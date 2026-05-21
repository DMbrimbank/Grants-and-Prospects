import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed BTS Programs
  const programs = [
    {
      name: 'AI Academy',
      description: 'Student-facing program within the AI Academy framework teaching practical AI literacy, ethics, and skills',
      stream: 'Future of Intelligence',
      yearLevels: '7-12',
      keywords: 'AI, machine learning, ethics, technology',
    },
    {
      name: 'GenIUS',
      description: '10-day innovation work experience program and competition where secondary students design real solutions for local small-business challenges',
      stream: 'Future of Communication',
      yearLevels: '9-10',
      keywords: 'innovation, entrepreneurship, design',
    },
    {
      name: 'Drone Racing',
      description: '10-week engineering, coding, and drone racing program culminating in a high-energy championship event',
      stream: 'Future of Intelligence',
      yearLevels: '9-12',
      keywords: 'drones, engineering, racing, coding',
    },
    {
      name: 'Job Readiness Program',
      description: 'Structured micro-credential course for Year 9–12 students delivered as a web application with 8 modules',
      stream: 'Future of Work',
      yearLevels: '9-12',
      keywords: 'employment, career, skills',
    },
    {
      name: 'Melbourne Airport Digital Twin',
      description: 'Immersive digital twin simulation of Melbourne Airport developed with Melbourne Airport using Unreal Engine 5',
      stream: 'Future of Intelligence',
      yearLevels: '7-12',
      keywords: 'VR, simulation, aviation',
    },
  ];

  let programCount = 0;
  for (const prog of programs) {
    const existing = await prisma.btsProgram.findFirst({ where: { name: prog.name } });
    if (!existing) {
      await prisma.btsProgram.create({ data: prog });
      programCount++;
    }
  }

  // Seed sample grants
  const grants = [
    {
      type: 'grant',
      title: 'Victorian Innovation Grants 2026',
      description: 'Support for innovative education programs that develop future skills in Victoria',
      organization: 'Department of Education, Victoria',
      sector: 'Education',
      stream: 'Future of Intelligence',
      fundingAmount: 250000,
      applicationDeadline: new Date('2026-08-31'),
      fitScore: 85,
      roiEstimate: 3.5,
      status: 'not_contacted',
      source: 'public_db',
      url: 'https://www.grants.vic.gov.au',
      notes: 'Good fit for AI Academy expansion',
      relatedPrograms: JSON.stringify(['AI Academy']),
    },
    {
      type: 'grant',
      title: 'Philanthropy Australia - Education for Change',
      description: 'Support for educational initiatives that prepare students for emerging careers',
      organization: 'Philanthropy Australia Foundation',
      sector: 'Education',
      stream: 'Future of Work',
      fundingAmount: 150000,
      applicationDeadline: new Date('2026-09-15'),
      fitScore: 78,
      roiEstimate: 2.8,
      status: 'not_contacted',
      source: 'public_db',
      url: 'https://www.philanthropy.org.au',
      notes: 'Strong alignment with Job Readiness Program',
      relatedPrograms: JSON.stringify(['Job Readiness Program']),
    },
    {
      type: 'grant',
      title: 'Tech Industries Foundation - Skills Development',
      description: 'Funding for programs developing technical skills in secondary students',
      organization: 'Tech Industries Foundation Australia',
      sector: 'Technology',
      stream: 'Future of Intelligence',
      fundingAmount: 300000,
      applicationDeadline: new Date('2026-07-30'),
      fitScore: 92,
      roiEstimate: 4.2,
      status: 'researching',
      source: 'public_db',
      url: 'https://www.techfoundation.org.au',
      notes: 'Perfect for Drone Racing championship',
      relatedPrograms: JSON.stringify(['Drone Racing']),
    },
  ];

  let grantCount = 0;
  for (const grant of grants) {
    const existing = await prisma.opportunity.findFirst({ where: { title: grant.title } });
    if (!existing) {
      await prisma.opportunity.create({
        data: {
          ...grant,
          applicationDeadline: grant.applicationDeadline,
        },
      });
      grantCount++;
    }
  }

  // Seed synthetic companies
  const companies = [
    {
      name: 'TechVision Australia',
      industry: 'Technology',
      sector: 'Software & AI',
      size: 'Large',
      location: 'Melbourne, VIC',
      website: 'https://techvision.com.au',
      fundingCapacity: 'High',
      csrFocus: 'Education, Innovation',
      notes: 'Interested in youth STEM programs',
      contactName: 'Contact Name TBD',
      email: 'partnerships@techvision.com.au',
      isReal: false,
    },
    {
      name: 'Green Future Engineering',
      industry: 'Sustainability',
      sector: 'Clean Energy',
      size: 'Medium',
      location: 'Melbourne, VIC',
      website: 'https://greenfutureeng.com.au',
      fundingCapacity: 'Medium',
      csrFocus: 'Sustainability, Education',
      notes: 'Strong CSR program',
      contactName: 'Contact Name TBD',
      isReal: false,
    },
    {
      name: 'Health Innovation Labs',
      industry: 'Healthcare',
      sector: 'Medical Technology',
      size: 'Medium',
      location: 'Parkville, VIC',
      website: 'https://healthinnovationlabs.com.au',
      fundingCapacity: 'High',
      csrFocus: 'Health Education',
      notes: 'Developing next-gen health tech',
      contactName: 'Contact Name TBD',
      isReal: false,
    },
    {
      name: 'Melbourne Manufacturing Hub',
      industry: 'Manufacturing',
      sector: 'Advanced Manufacturing',
      size: 'Large',
      location: 'Footscray, VIC',
      website: 'https://melbmanufacturing.com.au',
      fundingCapacity: 'High',
      csrFocus: 'Workforce Development',
      notes: 'Seeks talent pipeline partnerships',
      contactName: 'Contact Name TBD',
      isReal: false,
    },
    {
      name: 'Digital Futures Collective',
      industry: 'Technology',
      sector: 'Digital Services',
      size: 'Medium',
      location: 'Carlton, VIC',
      website: 'https://digitalfutures.com.au',
      fundingCapacity: 'Medium',
      csrFocus: 'Digital Skills, Inclusion',
      notes: 'Strong focus on youth employment',
      contactName: 'Contact Name TBD',
      email: 'community@digitalfutures.com.au',
      isReal: false,
    },
  ];

  let companyCount = 0;
  for (const company of companies) {
    const existing = await prisma.company.findFirst({ where: { name: company.name } });
    if (!existing) {
      await prisma.company.create({ data: company });
      companyCount++;
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${programCount} programs`);
  console.log(`💰 Created ${grantCount} grant opportunities`);
  console.log(`🏢 Created ${companyCount} partner companies`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
