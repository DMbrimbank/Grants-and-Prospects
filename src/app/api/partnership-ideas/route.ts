import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch ideas for a company or all ideas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    let where: any = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;

    const ideas = await prisma.partnershipIdea.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { generatedAt: 'desc' },
    });

    return Response.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return Response.json(
      { error: 'Failed to fetch partnership ideas' },
      { status: 500 }
    );
  }
}

// POST: Store generated partnership ideas
export async function POST(request: Request) {
  try {
    const { companyId, ideas } = await request.json();

    if (!companyId || !ideas || !Array.isArray(ideas)) {
      return Response.json(
        { error: 'companyId and ideas array required' },
        { status: 400 }
      );
    }

    // Create partnership ideas for this company
    const storedIdeas = await Promise.all(
      ideas.map((idea: any) =>
        prisma.partnershipIdea.create({
          data: {
            companyId,
            ideaName: idea.ideaName,
            whyAligned: idea.whyAligned,
            structure: idea.structure,
            streamIds: JSON.stringify(idea.streams || []),
            programIds: JSON.stringify(idea.programs || []),
            deliveryModelIds: JSON.stringify(idea.deliveryModels || []),
            estimatedBudget: idea.estimatedBudget
              ? parseFloat(idea.estimatedBudget.replace(/[^\d.]/g, ''))
              : null,
            studentImpactNumber: idea.studentImpactNumber || 0,
            studentImpactDescription: idea.studentImpactDescription,
            difficulty: idea.difficulty || 'Medium',
            firstContactAngle: idea.firstContactAngle,
            status: 'draft',
            generatedBy: 'claude',
          },
        })
      )
    );

    return Response.json({
      success: true,
      companyId,
      ideasStored: storedIdeas.length,
      ideas: storedIdeas,
    });
  } catch (error) {
    console.error('Error storing ideas:', error);
    return Response.json(
      { error: 'Failed to store partnership ideas' },
      { status: 500 }
    );
  }
}
