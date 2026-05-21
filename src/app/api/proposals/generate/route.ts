import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = `You are an expert grant writer for Brimbank Tech School (BTS), a Victorian tech education initiative serving 20,000 secondary students.

Grant Details:
- Title: ${body.grantTitle}
- Organization: ${body.organization}
- Description: ${body.grantDescription}
- Requested Amount: $${body.requestedAmount}

BTS Program Focus: ${body.btsProgram}
Target Outcome: ${body.targetOutcome}

Please write a compelling 3-4 paragraph grant proposal that:
1. Opens with a strong hook about the opportunity and impact
2. Clearly connects BTS programs to the grant's objectives
3. Demonstrates how the funding will transform student outcomes
4. Includes specific, measurable deliverables
5. Addresses the funder's priorities

Write the proposal in professional but accessible language. Focus on impact and outcomes.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const proposalText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    return Response.json({
      proposal: proposalText,
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    return Response.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
