import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const industry = searchParams.get('industry');
    const tierParam = searchParams.get('tier');
    const tier = tierParam ? parseInt(tierParam) : null;

    const companies = await prisma.company.findMany({
      where: {
        ...(sector && { sector }),
        ...(industry && { industry }),
        ...(tier && { tier }),
      },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    });

    return Response.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return Response.json(
      { error: 'Failed to fetch companies', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const company = await prisma.company.create({
      data: {
        name: body.name,
        industry: body.industry,
        sector: body.sector,
        size: body.size,
        location: body.location,
        website: body.website,
        fundingCapacity: body.fundingCapacity || 'Medium',
        csrFocus: body.csrFocus,
        notes: body.notes,
        tier: body.tier || 4,
        btsPrograms: body.btsPrograms,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        isReal: body.isReal || false,
      },
    });

    return Response.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return Response.json(
      { error: 'Failed to create company', details: String(error) },
      { status: 500 }
    );
  }
}
