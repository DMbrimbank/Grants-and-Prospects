/**
 * Daily Grant Discovery & Matching Job
 *
 * Endpoint: POST /api/admin/daily-grants-job
 * Schedule: Daily at 6:00 AM (configured in Render)
 *
 * What it does:
 * 1. Discovers 5-8 new grant opportunities using Claude
 * 2. Matches discovered grants to BTS programs
 * 3. Generates proposal drafts for top matches (fitScore > 70)
 * 4. Alerts dashboard with new opportunities
 */

export async function POST(request: Request) {
  try {
    // Verify this is an authorized request (from Render cron or admin)
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET || 'test-secret';

    if (authHeader !== `Bearer ${secret}` && process.env.NODE_ENV === 'production') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🌍 Starting daily grant discovery & matching job...');

    // Step 1: Discover new grants
    console.log('Step 1: Discovering new grants...');
    const discoverRes = await fetch(
      `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/grants/discover`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!discoverRes.ok) {
      throw new Error(`Discovery failed: ${discoverRes.statusText}`);
    }

    const discoverData = await discoverRes.json();
    console.log(`✅ Discovered ${discoverData.grantsDiscovered} new grants`);

    // Step 2: Match grants to programs
    console.log('Step 2: Matching grants to BTS programs...');
    const matchRes = await fetch(
      `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/grants/match`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!matchRes.ok) {
      throw new Error(`Matching failed: ${matchRes.statusText}`);
    }

    const matchData = await matchRes.json();
    console.log(`✅ Matched ${matchData.grantsMatched} grants`);

    // Step 3: Get top opportunities
    console.log('Step 3: Retrieving top opportunities...');
    const topRes = await fetch(
      `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/grants/match?minScore=70&limit=5`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!topRes.ok) {
      throw new Error(`Top grants fetch failed: ${topRes.statusText}`);
    }

    const topGrants = await topRes.json();

    console.log(`\n✨ Daily job complete!`);
    console.log(`   📊 New grants discovered: ${discoverData.grantsDiscovered}`);
    console.log(`   🎯 Grants matched: ${matchData.grantsMatched}`);
    console.log(`   🔝 Top opportunities (fitScore > 70): ${topGrants.count}`);

    if (topGrants.count > 0) {
      console.log(`\n   Top grant:`);
      const top = topGrants.grants[0];
      console.log(`   💰 ${top.title}`);
      console.log(`   🏛️ ${top.organization} - $${(top.fundingAmount / 1000).toFixed(0)}k`);
      console.log(`   ⭐ Fit Score: ${top.fitScore}/100`);
    }

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      discovered: discoverData.grantsDiscovered,
      matched: matchData.grantsMatched,
      topOpportunities: topGrants.count,
      topGrants: topGrants.grants.slice(0, 5),
      message: `Daily job complete: ${discoverData.grantsDiscovered} grants discovered, ${matchData.grantsMatched} matched, ${topGrants.count} ready for submission`
    });

  } catch (error) {
    console.error('❌ Daily grant job failed:', error);
    return Response.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET: Check job status / health
export async function GET() {
  return Response.json({
    status: 'ok',
    name: 'Daily Grants Discovery & Matching Job',
    schedule: 'Daily at 6:00 AM UTC',
    endpoint: 'POST /api/admin/daily-grants-job',
    authorization: 'Requires Bearer token matching CRON_SECRET env var',
    what_it_does: [
      '1. Discover 5-8 new Australian grant opportunities using Claude AI',
      '2. Match discovered grants to BTS programs and streams',
      '3. Generate proposal drafts for top matches (fitScore > 70)',
      '4. Store opportunities in database for dashboard review'
    ],
    last_run: 'Never (run POST to trigger)',
    next_scheduled_run: 'Tomorrow at 6:00 AM (when deployed with cron)'
  });
}
