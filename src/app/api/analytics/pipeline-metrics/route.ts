import { prisma } from '@/lib/prisma';

interface PipelineMetrics {
  totalOpportunities: number;
  byStatus: Record<string, number>;
  totalFunding: number;
  averageFitScore: number;
  opportunitiesByFitRange: {
    excellent: number; // 80-100
    good: number;      // 60-79
    moderate: number;  // 40-59
    low: number;       // 0-39
  };
  upcomingDeadlines: Array<{
    title: string;
    daysUntilDeadline: number;
    fundingAmount: number;
    fitScore: number;
  }>;
  conversionMetrics: {
    discoveredCount: number;
    researchingCount: number;
    appliedCount: number;
    conversionRate: string; // percentage
  };
  expectedFunding: {
    conservative: number; // weighted by fitScore * 0.5
    moderate: number;     // weighted by fitScore * 0.7
    optimistic: number;   // weighted by fitScore * 0.9
  };
  topOpportunities: Array<{
    id: string;
    title: string;
    organization: string;
    fundingAmount: number;
    fitScore: number;
    daysUntilDeadline: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

// GET: Retrieve pipeline metrics and ROI analysis
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'grant', 'partnership', 'all'

    const whereClause: any = {};
    if (type !== 'all') {
      whereClause.type = type;
    }

    // Fetch all opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: whereClause,
    });

    if (opportunities.length === 0) {
      return Response.json({
        success: true,
        metrics: {
          totalOpportunities: 0,
          byStatus: {},
          totalFunding: 0,
          averageFitScore: 0,
          opportunitiesByFitRange: {
            excellent: 0,
            good: 0,
            moderate: 0,
            low: 0,
          },
          upcomingDeadlines: [],
          conversionMetrics: {
            discoveredCount: 0,
            researchingCount: 0,
            appliedCount: 0,
            conversionRate: '0%',
          },
          expectedFunding: {
            conservative: 0,
            moderate: 0,
            optimistic: 0,
          },
          topOpportunities: [],
          statusDistribution: [],
        },
        message: 'No opportunities found',
      });
    }

    // Calculate metrics
    const metrics: PipelineMetrics = {
      totalOpportunities: opportunities.length,
      byStatus: {},
      totalFunding: 0,
      averageFitScore: 0,
      opportunitiesByFitRange: {
        excellent: 0,
        good: 0,
        moderate: 0,
        low: 0,
      },
      upcomingDeadlines: [],
      conversionMetrics: {
        discoveredCount: 0,
        researchingCount: 0,
        appliedCount: 0,
        conversionRate: '0%',
      },
      expectedFunding: {
        conservative: 0,
        moderate: 0,
        optimistic: 0,
      },
      topOpportunities: [],
      statusDistribution: [],
    };

    let totalFitScore = 0;
    const now = new Date();

    opportunities.forEach((opp) => {
      // Status distribution
      metrics.byStatus[opp.status] = (metrics.byStatus[opp.status] || 0) + 1;

      // Total and average fit score
      totalFitScore += opp.fitScore || 0;
      metrics.totalFunding += opp.fundingAmount || 0;

      // Fit score ranges
      const score = opp.fitScore || 0;
      if (score >= 80) metrics.opportunitiesByFitRange.excellent++;
      else if (score >= 60) metrics.opportunitiesByFitRange.good++;
      else if (score >= 40) metrics.opportunitiesByFitRange.moderate++;
      else metrics.opportunitiesByFitRange.low++;

      // Upcoming deadlines
      if (opp.applicationDeadline) {
        const daysUntil = Math.floor(
          (opp.applicationDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntil > 0 && daysUntil <= 60) {
          metrics.upcomingDeadlines.push({
            title: opp.title,
            daysUntilDeadline: daysUntil,
            fundingAmount: opp.fundingAmount || 0,
            fitScore: opp.fitScore || 0,
          });
        }
      }

      // Conversion metrics
      if (opp.source === 'ai_discovery') metrics.conversionMetrics.discoveredCount++;
      if (opp.status === 'researching') metrics.conversionMetrics.researchingCount++;
      if (opp.status === 'applied') metrics.conversionMetrics.appliedCount++;
    });

    // Calculate average fit score
    metrics.averageFitScore = Math.round(totalFitScore / opportunities.length);

    // Calculate conversion rate
    const conversionRate =
      metrics.conversionMetrics.discoveredCount > 0
        ? Math.round(
            (metrics.conversionMetrics.appliedCount /
              metrics.conversionMetrics.discoveredCount) *
            100
          )
        : 0;
    metrics.conversionMetrics.conversionRate = `${conversionRate}%`;

    // Calculate expected funding (weighted by fit score and success probability)
    opportunities.forEach((opp) => {
      const amount = opp.fundingAmount || 0;
      const fitMultiplier = (opp.fitScore || 50) / 100;

      metrics.expectedFunding.conservative += amount * fitMultiplier * 0.5;
      metrics.expectedFunding.moderate += amount * fitMultiplier * 0.7;
      metrics.expectedFunding.optimistic += amount * fitMultiplier * 0.9;
    });

    // Top opportunities (by fit score and deadline urgency)
    const topOppsSorted = opportunities
      .map((opp) => {
        const daysUntil = opp.applicationDeadline
          ? Math.floor(
              (opp.applicationDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          : 999;
        return {
          ...opp,
          daysUntilDeadline: daysUntil,
          urgencyScore: (opp.fitScore || 0) + Math.max(0, 30 - daysUntil), // Boost score if deadline is soon
        };
      })
      .sort((a, b) => b.urgencyScore - a.urgencyScore)
      .slice(0, 5)
      .map((opp) => ({
        id: opp.id,
        title: opp.title,
        organization: opp.organization || 'Unknown',
        fundingAmount: opp.fundingAmount || 0,
        fitScore: opp.fitScore || 0,
        daysUntilDeadline: opp.daysUntilDeadline,
      }));

    metrics.topOpportunities = topOppsSorted;

    // Sort upcoming deadlines by days remaining
    metrics.upcomingDeadlines.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

    // Status distribution with percentages
    metrics.statusDistribution = Object.entries(metrics.byStatus).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / opportunities.length) * 100),
    }));

    return Response.json({
      success: true,
      metrics,
      summary: {
        totalFunding: `$${(metrics.totalFunding / 1000).toFixed(0)}k`,
        expectedFunding: {
          conservative: `$${(metrics.expectedFunding.conservative / 1000).toFixed(0)}k`,
          moderate: `$${(metrics.expectedFunding.moderate / 1000).toFixed(0)}k`,
          optimistic: `$${(metrics.expectedFunding.optimistic / 1000).toFixed(0)}k`,
        },
        conversionRate: metrics.conversionMetrics.conversionRate,
        averageFitScore: metrics.averageFitScore,
        topPriority: metrics.topOpportunities[0] || null,
      },
    });
  } catch (error) {
    console.error('Error calculating pipeline metrics:', error);
    return Response.json(
      { error: 'Failed to calculate metrics', details: String(error) },
      { status: 500 }
    );
  }
}
