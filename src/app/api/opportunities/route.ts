import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const opportunities = await prisma.opportunity.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return Response.json(
      { error: 'Failed to fetch opportunities', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const opportunity = await prisma.opportunity.create({
      data: {
        type: body.type || 'grant',
        title: body.title,
        description: body.description || '',
        organization: body.organization,
        sector: body.sector,
        stream: body.stream,
        fundingAmount: body.fundingAmount ? parseInt(body.fundingAmount) : null,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        fitScore: body.fitScore || 0,
        roiEstimate: body.roiEstimate || 0,
        status: body.status || 'not_contacted',
        source: body.source || 'manual',
        url: body.url,
        notes: body.notes,
        relatedPrograms: body.relatedPrograms,
      },
    });

    return Response.json(opportunity, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return Response.json(
      { error: 'Failed to create opportunity', details: String(error) },
      { status: 500 }
    );
  }
}
