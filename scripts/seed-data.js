// Simple Node.js script to seed test data via API
// Run: node scripts/seed-data.js

const API_BASE = 'http://localhost:3000';

async function seedData() {
  console.log('🌱 Seeding BTS test data...\n');

  try {
    // 1. Create test company
    console.log('1️⃣ Creating test companies...');
    const companies = [
      {
        name: 'Google Australia',
        industry: 'Technology',
        sector: 'Tech/AI',
        size: 'Enterprise',
        location: 'Sydney, NSW',
        website: 'google.com.au',
        fundingCapacity: 'Very High',
        csrFocus: 'Education, STEM diversity, tech talent pipeline',
        tier: 1,
        btsPrograms: JSON.stringify(['RiverLens', 'Cyber Security Basics', 'Terminal Intelligence', 'SkyMind']),
        email: 'partnerships@google.com.au'
      },
      {
        name: 'BHP Group',
        industry: 'Mining & Resources',
        sector: 'Resources',
        size: 'Enterprise',
        location: 'Melbourne, VIC',
        website: 'bhp.com',
        fundingCapacity: 'Very High',
        csrFocus: 'Sustainability, Indigenous employment, women in STEM',
        tier: 1,
        btsPrograms: JSON.stringify(['WattWorks', 'Habitat Hub', 'RiverLens', 'H2Drive']),
        email: 'careers@bhp.com'
      },
      {
        name: 'National Australia Bank',
        industry: 'Financial Services',
        sector: 'Finance',
        size: 'Enterprise',
        location: 'Docklands, VIC',
        website: 'nab.com.au',
        fundingCapacity: 'Very High',
        csrFocus: 'Financial literacy, youth employment, community',
        tier: 1,
        btsPrograms: JSON.stringify(['Job Readiness', 'Cyber Security Basics', 'Cyber Shield']),
        email: 'partnerships@nab.com.au'
      },
      {
        name: 'Telstra',
        industry: 'Telecommunications',
        sector: 'Tech/Telecom',
        size: 'Enterprise',
        location: 'Melbourne, VIC',
        website: 'telstra.com.au',
        fundingCapacity: 'Very High',
        csrFocus: 'Digital inclusion, education, Indigenous communities',
        tier: 1,
        btsPrograms: JSON.stringify(['Communication', 'Future of Work', 'Cyber Security']),
        email: 'corporate.partnerships@telstra.com'
      },
      {
        name: 'Seek Limited',
        industry: 'Employment',
        sector: 'Tech/HR',
        size: 'Large',
        location: 'Melbourne, VIC',
        website: 'seek.com.au',
        fundingCapacity: 'High',
        csrFocus: 'Employment, career pathways, youth development',
        tier: 2,
        btsPrograms: JSON.stringify(['Job Readiness', 'Career Pathways', 'VET Taster']),
        email: 'partnerships@seek.com.au'
      }
    ];

    for (const company of companies) {
      try {
        const res = await fetch(`${API_BASE}/api/companies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(company)
        });
        if (res.ok) {
          console.log(`  ✅ ${company.name}`);
        }
      } catch (e) {
        console.log(`  ⚠️ ${company.name} - ${e.message}`);
      }
    }

    console.log(`\n✨ Seeding complete!\n`);
    console.log('📍 Test companies ready:');
    console.log('  - Google Australia (Tech, Tier 1)');
    console.log('  - BHP Group (Resources, Tier 1)');
    console.log('  - National Australia Bank (Finance, Tier 1)');
    console.log('  - Telstra (Telecom, Tier 1)');
    console.log('  - Seek Limited (Tech/HR, Tier 2)');
    console.log('\n🎯 Next: Go to Prospecting page and generate partnership ideas!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();
