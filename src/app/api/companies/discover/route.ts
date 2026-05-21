import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companies = Array.isArray(body) ? body : [body];

    if (!Array.isArray(companies) || companies.length === 0) {
      return Response.json(
        { error: 'Invalid request: expected array of companies' },
        { status: 400 }
      );
    }

    const results = {
      added: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const company of companies) {
      try {
        // Validate required fields
        if (!company.name || !company.industry || !company.sector) {
          results.errors.push(`Skipped ${company.name}: missing required fields`);
          results.skipped++;
          continue;
        }

        // Check if company already exists
        const existing = await prisma.company.findUnique({
          where: { name: company.name },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Create new company
        await prisma.company.create({
          data: {
            name: company.name,
            industry: company.industry,
            sector: company.sector,
            size: company.size || 'Medium',
            location: company.location || 'Australia',
            website: company.website,
            fundingCapacity: company.fundingCapacity || 'Medium',
            csrFocus: company.csrFocus,
            btsPrograms: JSON.stringify(company.btsPrograms || []),
            tier: company.tier || 4,
            notes: company.strategicFit,
            isReal: true,
          },
        });

        results.added++;
      } catch (error) {
        results.errors.push(
          `Error adding ${company.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return Response.json({
      success: true,
      message: `Added ${results.added} companies, skipped ${results.skipped} duplicates`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error discovering companies:', error);
    return Response.json(
      {
        error: 'Failed to process discoveries',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recently discovered companies (added in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentCompanies = await prisma.company.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return Response.json({
      discovered_today: recentCompanies.length,
      companies: recentCompanies,
    });
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    return Response.json(
      { error: 'Failed to fetch discoveries' },
      { status: 500 }
    );
  }
}
