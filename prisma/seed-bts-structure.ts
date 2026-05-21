import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BTS structure...\n');

  // STREAMS
  console.log('📍 Creating Streams...');
  const streams = await Promise.all([
    prisma.stream.upsert({
      where: { name: 'Future of Communication' },
      update: {},
      create: {
        name: 'Future of Communication',
        description: 'Digital storytelling, media, esports, content creation',
        color: '#10b981'
      }
    }),
    prisma.stream.upsert({
      where: { name: 'Future of Sustainability' },
      update: {},
      create: {
        name: 'Future of Sustainability',
        description: 'Energy, climate tech, circular economy, transportation',
        color: '#14b8a6'
      }
    }),
    prisma.stream.upsert({
      where: { name: 'Future of Health' },
      update: {},
      create: {
        name: 'Future of Health',
        description: 'Healthcare tech, adaptive devices, wellness, medical innovation',
        color: '#ef4444'
      }
    }),
    prisma.stream.upsert({
      where: { name: 'Future of Intelligence' },
      update: {},
      create: {
        name: 'Future of Intelligence',
        description: 'AI, cybersecurity, drones, data science, autonomous systems',
        color: '#3b82f6'
      }
    })
  ]);
  console.log(`✅ Created ${streams.length} streams\n`);

  // DELIVERY MODELS
  console.log('📍 Creating Delivery Models...');
  const deliveryModels = await Promise.all([
    prisma.deliveryModel.upsert({
      where: { name: 'Future of Work' },
      update: {},
      create: {
        name: 'Future of Work',
        description: 'Year 7-8, 1-hour rotating activities',
        yearLevels: '7-8',
        duration: '1 hour rotations'
      }
    }),
    prisma.deliveryModel.upsert({
      where: { name: 'Design Sprint' },
      update: {},
      create: {
        name: 'Design Sprint',
        description: 'Year 9-10, full-day project-based programs',
        yearLevels: '9-10',
        duration: 'Full day'
      }
    }),
    prisma.deliveryModel.upsert({
      where: { name: 'Embedded Programs' },
      update: {},
      create: {
        name: 'Embedded Programs',
        description: 'Year 9-12, extended initiatives and startups',
        yearLevels: '9-12',
        duration: 'Extended (semester/year)'
      }
    })
  ]);
  console.log(`✅ Created ${deliveryModels.length} delivery models\n`);

  // PROGRAMS
  console.log('📍 Creating Programs...');
  const programData = [
    // Future of Communication
    { name: 'Mic-Drop: The 90-Second PodBite', description: 'Practice podcast creation with mic technique and scripting', streamId: streams[0].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'Podcast mics, DAW software' },
    { name: 'Unreal Futures: Build a World', description: 'Create scenes in Unreal Engine and export reels', streamId: streams[0].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'Unreal Engine 5, Meta Quest 3' },
    { name: 'Amplify: Stories That Matter', description: 'Deep-dive video storytelling and narrative design', streamId: streams[0].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'Video editing, game engines' },
    { name: 'Level Up Game-Day Ops', description: 'Game operations and competitive gaming infrastructure', streamId: streams[0].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'Game engines, streaming tech' },
    { name: 'Arena Lab: Your Esports Startup', description: 'Build and launch esports organization', streamId: streams[0].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: 'Full esports setup' },

    // Future of Sustainability
    { name: 'PowerPlay: Mini-Grid Adventure', description: 'Smart grid simulation and energy management', streamId: streams[1].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'micro:bit, Arduino' },
    { name: 'H2Drive: Clean-Energy Machines', description: 'Build and test hydrogen-powered vehicles', streamId: streams[1].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'Arduino, ANSYS, H2 kits' },
    { name: 'WattWorks: Energy Futures Sprint', description: 'Design energy solutions for real-world challenges', streamId: streams[1].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'Arduino, energy modeling' },
    { name: 'CargoFlow: Smarter, Greener Freight', description: 'Logistics and supply chain optimization', streamId: streams[1].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'Modeling software, data analysis' },
    { name: 'Habitat Hub: Sustainable Communities', description: 'Design sustainable living solutions', streamId: streams[1].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: '3D design, CAD' },
    { name: 'Velocity Pit: Eco-Racing Challenge', description: 'Build and race sustainable vehicles', streamId: streams[1].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: 'Engineering tools, autonomous tech' },

    // Future of Health
    { name: 'NeuroSense: Signals and Systems', description: 'Biometric signals and health monitoring', streamId: streams[2].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'Arduino, micro:bit, sensors' },
    { name: 'Make4Motion: Adaptive Build Sprint', description: 'Prototype adaptive sports aids and devices', streamId: streams[2].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: '3D printers, Arduino, design tools' },
    { name: 'Coach.AI: Performance Tech Studio', description: 'AI-powered athletic performance analysis', streamId: streams[2].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'AI/ML, wearables, data analysis' },
    { name: 'ReFashion Clinic', description: 'Upcycling and sustainable fashion design', streamId: streams[2].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'Design tools, 3D printers' },
    { name: 'FusionWear: Smart Fashion Lab', description: 'Advanced wearable technology in fashion', streamId: streams[2].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: 'Advanced wearables, textiles tech' },

    // Future of Intelligence
    { name: 'SkyMind: Drones & Data', description: 'Drone programming and data collection', streamId: streams[3].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'Drones, Python, sensors' },
    { name: 'BreachBox: Escape Challenge', description: 'Cybersecurity challenges and puzzles', streamId: streams[3].id, deliveryModelId: deliveryModels[0].id, yearLevels: '7-8', tools: 'CTF platforms, security tools' },
    { name: 'Terminal Intelligence', description: 'Airport simulation and optimization', streamId: streams[3].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'ArcGIS, game development, data analysis' },
    { name: 'Cyber Security Basics: Ethics, Humans and Hacks', description: 'Introduction to cybersecurity principles', streamId: streams[3].id, deliveryModelId: deliveryModels[1].id, yearLevels: '9-10', tools: 'SOC tools, threat hunting' },
    { name: 'RiverLens: Mapping Change', description: 'Geospatial data and environmental intelligence', streamId: streams[3].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: 'ArcGIS, ML models, sensors' },
    { name: 'Cyber Shield: Build Your SOC', description: 'Full cybersecurity operations center simulation', streamId: streams[3].id, deliveryModelId: deliveryModels[2].id, yearLevels: '9-12', tools: 'Enterprise security tools, SIEM' }
  ];

  const programs = await Promise.all(
    programData.map(p =>
      prisma.program.upsert({
        where: { id: '' },
        update: {},
        create: {
          name: p.name,
          description: p.description,
          streamId: p.streamId,
          deliveryModelId: p.deliveryModelId,
          yearLevels: p.yearLevels,
          tools: p.tools,
          keywords: p.name.toLowerCase()
        }
      }).catch(() => null)
    )
  ).then(results => results.filter(r => r !== null));

  console.log(`✅ Created ${programs.length} programs\n`);

  // PROJECTS
  console.log('📍 Creating Projects...');
  const projectData = [
    { name: 'Build & Bond', description: 'Fathers + sons STEM bonding event with robotics, drones, VR, AR', date: new Date('2026-09-04'), studentImpact: 150, budget: 25000 },
    { name: 'GenIUS', description: '10-day innovation competition for local business challenges', date: new Date('2026-08-18'), studentImpact: 200, budget: 40000 },
    { name: 'FNAD', description: 'First Nations + STEM cultural experience', date: new Date('2026-08-07'), studentImpact: 100, budget: 15000 },
    { name: 'Girls in Eng', description: 'Program encouraging girls into engineering and STEM careers', studentImpact: 80, budget: 20000 },
    { name: 'Drone Racing', description: '10-week engineering program culminating in championship event', date: new Date('2026-12-09'), studentImpact: 120, budget: 50000 },
    { name: 'VU Tech Schools Ind. Edu Conference', description: 'Annual two-day conference for tech education professionals', date: new Date('2026-09-01'), studentImpact: 500, budget: 60000 },
    { name: 'Mel Air Digital Twin', description: 'Interactive Melbourne Airport simulation in Unreal Engine 5', studentImpact: 300, budget: 80000 },
    { name: 'Mel Air (Innovation) Trailer', description: 'Mobile classroom touring schools with Melbourne Airport content', studentImpact: 400, budget: 35000 },
    { name: 'Job Readiness Program', description: '8-module micro-credential course for career pathways', studentImpact: 250, budget: 30000 },
    { name: 'VET Taster Program', description: 'Exposure to vocational education and training pathways', studentImpact: 150, budget: 20000 },
    { name: 'AI Skills Program', description: 'Practical AI literacy and ethics within AI Academy framework', studentImpact: 200, budget: 25000 },
    { name: 'STEM COP', description: 'Community of Practice for STEM educators in South West Victoria', studentImpact: 50, budget: 15000 },
    { name: 'Living Classroom', description: 'Major collaborative project with Victoria University', studentImpact: 100, budget: 75000 },
    { name: 'PMY Hack-a-thon', description: 'Problem-solving competition with PMY Group', studentImpact: 80, budget: 12000 }
  ];

  const projects = await Promise.all(
    projectData.map(p =>
      prisma.project.upsert({
        where: { name: p.name },
        update: {},
        create: {
          name: p.name,
          description: p.description,
          date: p.date,
          studentImpact: p.studentImpact,
          budget: p.budget,
          status: 'active',
          streamIds: JSON.stringify([streams[0].id, streams[1].id]) // Most span multiple streams
        }
      })
    )
  );

  console.log(`✅ Created ${projects.length} projects\n`);

  // TEST COMPANIES
  console.log('📍 Creating test companies...');
  const testCompanies = await Promise.all([
    prisma.company.upsert({
      where: { name: 'Google Australia' },
      update: {},
      create: {
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
        isReal: true,
        email: 'partnerships@google.com.au'
      }
    }),
    prisma.company.upsert({
      where: { name: 'BHP Group' },
      update: {},
      create: {
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
        isReal: true,
        email: 'careers@bhp.com'
      }
    }),
    prisma.company.upsert({
      where: { name: 'NAB' },
      update: {},
      create: {
        name: 'NAB',
        industry: 'Financial Services',
        sector: 'Finance',
        size: 'Enterprise',
        location: 'Docklands, VIC',
        website: 'nab.com.au',
        fundingCapacity: 'Very High',
        csrFocus: 'Financial literacy, youth employment, community',
        tier: 1,
        btsPrograms: JSON.stringify(['Job Readiness', 'Cyber Security Basics', 'Cyber Shield']),
        isReal: true,
        email: 'partnerships@nab.com.au'
      }
    })
  ]);

  console.log(`✅ Created ${testCompanies.length} test companies\n`);

  console.log('✨ Seeding complete!');
  console.log(`
  Summary:
  - Streams: ${streams.length}
  - Delivery Models: ${deliveryModels.length}
  - Programs: ${programs.length}
  - Projects: ${projects.length}
  - Test Companies: ${testCompanies.length}
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
