import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = `You are a professional business development expert writing cold outreach emails for Brimbank Tech School (BTS), a Victorian tech education initiative.

Company: ${body.companyName}
Sector: ${body.sector}
Collaboration Ideas: ${body.collaborationIdeas}
Contact Name: ${body.contactName}

Write a compelling, personalized cold outreach email that:
1. Opens with a warm greeting
2. Shows you understand their company and sector
3. Explains how BTS programs align with their business
4. Proposes specific collaboration opportunities
5. Mentions visiting www.brimbanktechschool.edu.au for more information
6. Asks for a meeting or call in a friendly way
7. Closes professionally

Keep it concise - about 200-250 words.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const emailText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    return Response.json({ email: emailText });
  } catch (error) {
    console.error('Error generating email:', error);
    return Response.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}
