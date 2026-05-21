import { Anthropic } from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const prisma = new PrismaClient();

interface GrantMatch {
  grantId: string;
  fitScore: number;
  matchedPrograms: string[];
  proposalDraft: string;
  reasoning: string;
}

// POST: Match discovered grants to BTS programs and generate proposals
export async function POST() {
  try {
    // Get all unmatched recent grants
    const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const grants = await prisma.opportunity.findMany({
      where: {
        type: 'grant',
        source: 'ai_discovery',
        createdAt: { gte: recentDate },
        fitScore: { equals: 0 } // Not yet scored
      },
      take: 10
    });

    if (grants.length === 0) {
      return Response.json({
        success: true,
        message: 'No unmatched grants to process',
        matches: []
      });
    }

    console.log(`Matching ${grants.length} grants to BTS programs...`);

    const matches: GrantMatch[] = [];

    for (const grant of grants) {
      try {
        const matchPrompt = `
        You are matching a grant opportunity to Brimbank Tech School's programs.

        GRANT DETAILS:
        Title: ${grant.title}
        Funder: ${grant.organization}
        Amount: $${grant.fundingAmount}
        Deadline: ${grant.applicationDeadline?.toLocaleDateString()}
        Description: ${grant.description}

        BTS STRUCTURE:
        Streams: Future of Communication, Future of Sustainability, Future of Health, Future of Intelligence

        Programs:
        Communication: Mic-Drop PodBite, Unreal Futures, Amplify, Level Up Game-Day, Arena Lab Esports
        Sustainability: PowerPlay Grid, H2Drive, WattWorks, CargoFlow, Habitat Hub, Velocity Pit Racing
        Health: NeuroSense Signals, Make4Motion Adaptive, Coach.AI, FusionWear
        Intelligence: SkyMind Drones, BreachBox CTF, Terminal Intelligence, Cyber Basics, RiverLens, Cyber Shield

        Student Impact: 1,500/year across Year 7-12
        Location: Melbourne/Brimbank region

        TASK:
        1. Analyze grant criteria and match to BTS programs (0-100 fit score)
        2. Identify which specific programs align
        3. Generate a 150-word proposal draft that:
           - Explains why this grant is perfect for BTS
           - Links specific programs to grant criteria
           - Quantifies student impact
           - Highlights alignment with funder's goals

        Return valid JSON:
        {
          "fitScore": 0-100,
          "matchedPrograms": ["Program1", "Program2"],
          "reasoning": "Why this matches",
          "proposalDraft": "150-word proposal text"
        }
        `;

        const matchResponse = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: matchPrompt
            }
          ]
        });

        const matchText =
          matchResponse.content[0].type === 'text'
            ? matchResponse.content[0].text
            : '';

        const jsonMatch = matchText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const matchData = JSON.parse(jsonMatch[0]);

          // Update grant with scores
          await prisma.opportunity.update({
            where: { id: grant.id },
            data: {
              fitScore: matchData.fitScore || 0,
              relatedPrograms: JSON.stringify(
                matchData.matchedPrograms || []
              ),
              notes: matchData.proposalDraft || grant.notes
            }
          });

          matches.push({
            grantId: grant.id,
            fitScore: matchData.fitScore || 0,
            matchedPrograms: matchData.matchedPrograms || [],
            proposalDraft: matchData.proposalDraft || '',
            reasoning: matchData.reasoning || ''
          });
        }
      } catch (e) {
        console.log(`Error matching grant ${grant.title}:`, e);
      }
    }

    // Sort by fit score
    matches.sort((a, b) => b.fitScore - a.fitScore);

    return Response.json({
      success: true,
      grantsMatched: matches.length,
      topMatches: matches.slice(0, 5),
      allMatches: matches,
      message: `Matched ${matches.length} grants. Top ${Math.min(5, matches.length)} are ready for proposal submission.`
    });
  } catch (error) {
    console.error('Error matching grants:', error);
    return Response.json(
      { error: 'Failed to match grants', details: String(error) },
      { status: 500 }
    );
  }
}

// GET: Get top-scored grants ready for submission
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minFitScore = parseInt(searchParams.get('minScore') || '70');
    const limit = parseInt(searchParams.get('limit') || '10');

    const topGrants = await prisma.opportunity.findMany({
      where: {
        type: 'grant',
        fitScore: { gte: minFitScore },
        status: { in: ['not_contacted', 'researching'] }
      },
      orderBy: { fitScore: 'desc' },
      take: limit
    });

    return Response.json({
      success: true,
      count: topGrants.length,
      minFitScore,
      grants: topGrants
    });
  } catch (error) {
    console.error('Error fetching top grants:', error);
    return Response.json(
      { error: 'Failed to fetch top grants' },
      { status: 500 }
    );
  }
}
