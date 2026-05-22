import { Anthropic } from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FollowUpSuggestion {
  suggestedDate: string;
  suggestedTiming: string; // e.g. "7 days", "14 days", "3 days"
  reasoning: string;
  messageTemplate: string;
  priority: 'high' | 'medium' | 'low';
}

// POST: Get AI-suggested follow-up timing and messaging for a contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactId } = body;

    if (!contactId) {
      return Response.json(
        { error: 'contactId is required' },
        { status: 400 }
      );
    }

    // Fetch contact with opportunity details
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        opportunity: {
          select: {
            title: true,
            type: true,
            organization: true,
            fundingAmount: true,
            applicationDeadline: true,
            stream: true,
            fitScore: true,
          }
        }
      }
    });

    if (!contact) {
      return Response.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const daysSinceContact = Math.floor(
      (Date.now() - contact.contactDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const prompt = `
You are a grant and partnership outreach strategist. Based on this contact interaction, suggest the optimal follow-up timing and create a brief follow-up message template.

CONTACT DETAILS:
Name: ${contact.contactName}
Organization: ${contact.organization}
Role: ${contact.role || 'Unknown'}
Contact Date: ${contact.contactDate.toLocaleDateString()}
Days Since Contact: ${daysSinceContact}
Contact Method: ${contact.contactMethod}
Relationship Stage: ${contact.relationshipStage}
Last Action: ${contact.lastAction || 'Initial contact made'}
Notes: ${contact.notes || 'None'}

OPPORTUNITY DETAILS:
Title: ${contact.opportunity?.title}
Type: ${contact.opportunity?.type}
Funder/Partner: ${contact.opportunity?.organization}
Amount: $${contact.opportunity?.fundingAmount?.toLocaleString() || 'N/A'}
Application Deadline: ${contact.opportunity?.applicationDeadline ? new Date(contact.opportunity.applicationDeadline).toLocaleDateString() : 'TBD'}
Stream: ${contact.opportunity?.stream || 'General'}
Fit Score: ${contact.opportunity?.fitScore || 'N/A'}/100

TASK:
1. Determine optimal follow-up timing based on:
   - Relationship stage (lead, warm_lead, active, partnership)
   - Days since last contact
   - Application deadline urgency (if applicable)
   - Contact method effectiveness

2. Create a brief 2-3 sentence follow-up message template that:
   - References the initial contact and opportunity
   - Shows genuine interest and understanding
   - Includes a clear call-to-action
   - Feels personal, not generic

3. Set priority level:
   - HIGH: Deadline within 30 days OR warm relationship needing momentum
   - MEDIUM: Standard follow-up (14-21 days since contact)
   - LOW: Early-stage lead, can wait (7+ days since contact)

Return ONLY valid JSON (no markdown, no extra text):
{
  "suggestedDate": "ISO date string for suggested follow-up",
  "suggestedTiming": "human readable timing (e.g. '7 days', '2 weeks', 'ASAP')",
  "reasoning": "Brief explanation of timing choice",
  "messageTemplate": "Follow-up message text",
  "priority": "high|medium|low"
}
`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse suggestion response');
    }

    const suggestion = JSON.parse(jsonMatch[0]) as FollowUpSuggestion;

    // Optionally update the contact's nextAction fields
    if (body.autoUpdate) {
      await prisma.contact.update({
        where: { id: contactId },
        data: {
          nextAction: suggestion.messageTemplate,
          nextActionDate: new Date(suggestion.suggestedDate),
        },
      });
    }

    return Response.json({
      success: true,
      contactId,
      suggestion,
      message: `Follow-up suggestion generated. Priority: ${suggestion.priority}`
    });

  } catch (error) {
    console.error('Error generating follow-up suggestion:', error);
    return Response.json(
      { error: 'Failed to generate suggestion', details: String(error) },
      { status: 500 }
    );
  }
}

// GET: Get suggestions for multiple contacts (batch)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const overdueDaysOnly = searchParams.get('overdue') === 'true';

    const whereClause: any = {};
    if (opportunityId) whereClause.opportunityId = opportunityId;
    if (overdueDaysOnly) {
      // Only contacts past their nextActionDate
      whereClause.nextActionDate = { lt: new Date() };
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      include: {
        opportunity: {
          select: {
            title: true,
            type: true,
            organization: true,
            applicationDeadline: true,
            fitScore: true,
          }
        }
      },
      orderBy: { nextActionDate: 'asc' },
      take: 20
    });

    return Response.json({
      success: true,
      count: contacts.length,
      contacts,
      message: overdueDaysOnly
        ? `${contacts.length} contacts with overdue follow-ups`
        : `${contacts.length} contacts ready for follow-up suggestions`
    });

  } catch (error) {
    console.error('Error fetching contacts for suggestions:', error);
    return Response.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
