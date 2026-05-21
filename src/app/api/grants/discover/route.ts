import { Anthropic } from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const prisma = new PrismaClient();

// GET: Retrieve recently discovered grants
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hoursAgo = parseInt(searchParams.get('hours') || '24');
    const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const grants = await prisma.opportunity.findMany({
      where: {
        type: 'grant',
        source: 'ai_discovery',
        createdAt: {
          gte: cutoffDate
        }
      },
      orderBy: { fitScore: 'desc' },
      take: 50
    });

    return Response.json({
      success: true,
      count: grants.length,
      hoursAgo,
      grants
    });
  } catch (error) {
    console.error('Error fetching discovered grants:', error);
    return Response.json(
      { error: 'Failed to fetch discovered grants' },
      { status: 500 }
    );
  }
}

// POST: Discover new grants using Claude
export async function POST() {
  try {
    // Get BTS context for matching
    const prompt = `
    You are a grant discovery specialist for Brimbank Tech School (BTS).

    BTS operates in 4 streams:
    1. Future of Communication - Digital storytelling, media, esports
    2. Future of Sustainability - Energy, climate tech, circular economy
    3. Future of Health - Healthcare tech, adaptive devices, wellness
    4. Future of Intelligence - AI, cybersecurity, drones, data science

    KEY PROGRAMS:
    Communication: Mic-Drop PodBite, Unreal Futures, Amplify, Level Up, Arena Lab
    Sustainability: PowerPlay, H2Drive, WattWorks, CargoFlow, Habitat Hub, Velocity Pit
    Health: NeuroSense, Make4Motion, Coach.AI, FusionWear
    Intelligence: SkyMind, BreachBox, Terminal Intelligence, Cyber Basics, RiverLens, Cyber Shield

    STUDENT IMPACT: ~1,500 students/year, Year 7-12
    LOCATION: Melbourne/Brimbank region
    FUNDING: VU-hosted, government-funded, seeking additional grants

    TASK: Generate 5-8 realistic Australian grant opportunities that BTS could apply for.

    For each grant, return valid JSON with this structure:
    {
      "title": "Grant name",
      "funder": "Funder organization",
      "amount": 250000,
      "deadline": "2026-09-30",
      "description": "What this grant funds",
      "matchedStreams": ["Future of Intelligence", "Future of Health"],
      "matchedPrograms": ["RiverLens", "Coach.AI"],
      "fitScore": 85,
      "whyAligned": "Why this grant matches BTS"
    }

    Make grants realistic, specific, and achievable. Include government grants, foundation grants, and corporate grants.
    Focus on grants between $50k-$500k (most achievable for schools).
    Deadlines should be 2026-2027 (realistic timeframe).

    Return as JSON array. Example:
    [
      {
        "title": "Australian Digital Skills Grant",
        "funder": "Department of Education",
        "amount": 200000,
        ...
      }
    ]
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json(
        { error: 'Could not parse grant data', raw: responseText },
        { status: 500 }
      );
    }

    const discoveredGrants = JSON.parse(jsonMatch[0]);

    // Store in database
    const storedGrants = await Promise.all(
      discoveredGrants.map((grant: any) =>
        prisma.opportunity.create({
          data: {
            type: 'grant',
            title: grant.title,
            description: grant.description,
            organization: grant.funder,
            fundingAmount: grant.amount,
            applicationDeadline: new Date(grant.deadline),
            fitScore: grant.fitScore || 0,
            status: 'not_contacted',
            source: 'ai_discovery',
            relatedPrograms: JSON.stringify(grant.matchedPrograms || []),
            notes: grant.whyAligned || ''
          }
        }).catch(() => {
          console.log(`Skipped duplicate grant: ${grant.title}`);
          return null;
        })
      )
    ).then(results => results.filter(r => r !== null));

    return Response.json({
      success: true,
      grantsDiscovered: storedGrants.length,
      grants: storedGrants,
      message: `Discovered ${storedGrants.length} new grant opportunities for BTS`
    });
  } catch (error) {
    console.error('Error discovering grants:', error);
    return Response.json(
      { error: 'Failed to discover grants', details: String(error) },
      { status: 500 }
    );
  }
}
