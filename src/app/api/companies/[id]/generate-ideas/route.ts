import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;

    // In a real implementation, fetch company from DB
    // For now, accept company data in request body
    const { company } = await request.json();

    if (!company) {
      return Response.json(
        { error: 'Company data required' },
        { status: 400 }
      );
    }

    // BTS context for Claude
    const btsContext = `
    BTS STRUCTURE:

    4 STREAMS:
    1. Future of Communication - Digital storytelling, media, esports, content creation
    2. Future of Sustainability - Energy, climate tech, circular economy, transportation
    3. Future of Health - Healthcare tech, adaptive devices, wellness
    4. Future of Intelligence - AI, cybersecurity, drones, data science

    3 DELIVERY MODELS:
    - Future of Work (Year 7-8, 1-hour activities)
    - Design Sprint (Year 9-10, full-day programs)
    - Embedded Programs (Year 9-12, extended initiatives)

    KEY PROGRAMS:
    Communication: Mic-Drop PodBite, Unreal Futures, Amplify Stories, Level Up Game-Day, Arena Lab Esports
    Sustainability: PowerPlay Grid, H2Drive, WattWorks, CargoFlow, Habitat Hub, Velocity Pit Racing
    Health: NeuroSense Signals, Make4Motion Adaptive, Coach.AI Performance, ReFashion, FusionWear
    Intelligence: SkyMind Drones, BreachBox CTF, Terminal Intelligence, Cyber Security Basics, RiverLens, Cyber Shield

    STUDENT IMPACT: ~1,500 students/year
    FUNDING: VU-funded + grant-supported
    `;

    const prompt = `
    ${btsContext}

    COMPANY TO ANALYZE:
    Name: ${company.name}
    Sector: ${company.sector}
    Size: ${company.size}
    Location: ${company.location}
    CSR Focus: ${company.csrFocus}
    Funding Capacity: ${company.fundingCapacity}
    Website: ${company.website || 'Not provided'}

    TASK: Generate 3-5 strategic partnership ideas that:
    1. Align with the company's CSR/business priorities
    2. Provide measurable student impact (specific number of students)
    3. Match the company's funding capacity
    4. Are achievable and specific (not vague)
    5. Link to specific BTS streams, programs, and delivery models

    OUTPUT: Return valid JSON array with this structure for each idea:
    {
      "ideaName": "Name of partnership idea",
      "whyAligned": "Why this works for [company name] and BTS",
      "streams": ["Stream names this covers"],
      "programs": ["Specific program names"],
      "deliveryModels": ["Future of Work" / "Design Sprint" / "Embedded Programs"],
      "structure": "Detailed description of how partnership works",
      "estimatedBudget": "$X/year or $X one-time",
      "studentImpactNumber": number of students,
      "studentImpactDescription": "What students gain",
      "difficulty": "Easy" or "Medium" or "Hard",
      "firstContactAngle": "How to pitch in 30 seconds"
    }

    Be specific, realistic, and focused on mutual value creation.
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json(
        { error: 'Could not generate ideas', raw: responseText },
        { status: 500 }
      );
    }

    const ideas = JSON.parse(jsonMatch[0]);

    // In a real implementation, store these in database
    // For now, return them directly

    return Response.json({
      success: true,
      companyId,
      companyName: company.name,
      ideasGenerated: ideas.length,
      ideas: ideas,
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return Response.json(
      { error: 'Failed to generate partnership ideas', details: String(error) },
      { status: 500 }
    );
  }
}
