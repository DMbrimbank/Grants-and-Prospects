import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const opportunities = await prisma.opportunity.findMany();

    const total = opportunities.length;
    const active = opportunities.filter(
      (opp) => ['prepared', 'applied', 'active_conversation'].includes(opp.status)
    ).length;

    const totalFunding = opportunities.reduce((sum, opp) => sum + (opp.fundingAmount || 0), 0);

    const successCount = opportunities.filter(
      (opp) => ['applied', 'partnership'].includes(opp.status)
    ).length;
    const conversionRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

    return Response.json({
      total,
      active,
      totalFunding,
      conversionRate,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return Response.json(
      { error: 'Failed to fetch summary', details: String(error) },
      { status: 500 }
    );
  }
}
