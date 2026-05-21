import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST() {
  try {
    // Call Claude to discover new prospects
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a business development AI assistant for Brimbank Tech School (BTS). Your task is to discover 20-30 new Australian companies that would be excellent prospects for partnerships and funding opportunities.

CONTEXT:
BTS is a Victorian tech education school serving 20,000+ secondary students. They offer programs in:
- AI Academy (AI/ML education, robotics, future tech)
- GenIUS (Engineering, drone racing, innovation)
- Future of Communication (Digital media, marketing, content creation)
- Job Readiness & Career Development
- Health & Wellbeing Programs
- Sustainability & Green Technology

TASK:
Identify 20-30 NEW Australian companies (not mega-famous corporations) that would strategically benefit from partnering with BTS. Focus on growth companies, industry leaders in emerging sectors, and regional players.

FOR EACH PROSPECT, PROVIDE:
1. Company Name
2. Industry
3. Sector (Technology, Finance, Energy, Healthcare, Manufacturing, Retail, etc.)
4. Company Size (Small, Medium, Large, Enterprise)
5. Location (Australian city/state)
6. Website
7. Funding Capacity (Low, Medium, High)
8. CSR Focus (Innovation, Education, Sustainability, Youth Employment, etc.)
9. Aligned BTS Programs (list which BTS programs match)
10. Business Tier (1-4: 1=Top 50 ASX, 2=ASX 51-150, 3=ASX 151-300, 4=Regional/SME)
11. Strategic Fit Explanation

OUTPUT FORMAT (JSON ONLY):
[
  {
    "name": "Company Name",
    "industry": "Industry",
    "sector": "Sector",
    "size": "Size",
    "location": "City, State",
    "website": "https://example.com",
    "fundingCapacity": "High/Medium/Low",
    "csrFocus": "Focus areas",
    "btsPrograms": ["Program 1", "Program 2"],
    "tier": 2,
    "strategicFit": "Why this is a good fit"
  }
]

Provide ONLY the JSON array, no other text.`,
        },
      ],
    });

    // Extract the text response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    let discoveredCompanies = [];
    try {
      // Try to find JSON array in the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        discoveredCompanies = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      return Response.json(
        {
          error: 'Failed to parse Claude response',
          raw_response: responseText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // Send discovered companies to the discovery API
    const discoverResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3003'}/api/companies/discover`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discoveredCompanies),
      }
    );

    const discoverResult = await discoverResponse.json();

    return Response.json({
      success: true,
      discovered: discoveredCompanies.length,
      database_result: discoverResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Prospect discovery error:', error);
    return Response.json(
      {
        error: 'Failed to trigger discovery',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
