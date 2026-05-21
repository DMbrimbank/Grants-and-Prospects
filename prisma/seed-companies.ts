import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PARTNER_COMPANIES = [
  {
    name: 'Tesla Australia',
    industry: 'Automotive',
    sector: 'Automotive',
    size: 'Enterprise',
    location: 'Melbourne, VIC',
    website: 'https://www.tesla.com/au',
    fundingCapacity: 'High',
    csrFocus: 'Sustainable Transportation, Innovation',
    contactName: 'Sustainability Team',
    email: 'sustainability@tesla.com',
    isReal: true,
  },
  {
    name: 'Audi Australia',
    industry: 'Automotive',
    sector: 'Automotive',
    size: 'Enterprise',
    location: 'Melbourne, VIC',
    website: 'https://www.audi.com.au',
    fundingCapacity: 'High',
    csrFocus: 'Sustainable Mobility, Education',
    contactName: 'CSR Department',
    email: 'csr@audi.com.au',
    isReal: true,
  },
  {
    name: 'Google Australia',
    industry: 'Technology',
    sector: 'Technology',
    size: 'Enterprise',
    location: 'Sydney, NSW',
    website: 'https://www.google.com.au',
    fundingCapacity: 'High',
    csrFocus: 'AI Education, Digital Skills',
    contactName: 'Education Partnerships',
    email: 'education-partnerships@google.com',
    isReal: true,
  },
  {
    name: 'Microsoft Australia',
    industry: 'Technology',
    sector: 'Technology',
    size: 'Enterprise',
    location: 'Sydney, NSW',
    website: 'https://www.microsoft.com/en-au',
    fundingCapacity: 'High',
    csrFocus: 'Tech Education, Youth Skills',
    contactName: 'Education Programs',
    email: 'eduprograms@microsoft.com',
    isReal: true,
  },
  {
    name: 'BHP Group',
    industry: 'Mining & Energy',
    sector: 'Energy',
    size: 'Enterprise',
    location: 'Melbourne, VIC',
    website: 'https://www.bhpgroup.com',
    fundingCapacity: 'High',
    csrFocus: 'STEM Education, Sustainability',
    contactName: 'Community Relations',
    email: 'community@bhpgroup.com',
    isReal: true,
  },
  {
    name: 'Commonwealth Bank',
    industry: 'Finance',
    sector: 'Finance',
    size: 'Enterprise',
    location: 'Sydney, NSW',
    website: 'https://www.commbank.com.au',
    fundingCapacity: 'High',
    csrFocus: 'Financial Literacy, Youth Programs',
    contactName: 'Foundation Team',
    email: 'foundation@cba.com.au',
    isReal: true,
  },
  {
    name: 'Telstra',
    industry: 'Telecommunications',
    sector: 'Technology',
    size: 'Enterprise',
    location: 'Melbourne, VIC',
    website: 'https://www.telstra.com.au',
    fundingCapacity: 'High',
    csrFocus: 'Digital Skills, Tech Education',
    contactName: 'Foundation Relations',
    email: 'foundation@telstra.com',
    isReal: true,
  },
  {
    name: 'Cisco Systems Australia',
    industry: 'Technology',
    sector: 'Technology',
    size: 'Enterprise',
    location: 'Sydney, NSW',
    website: 'https://www.cisco.com/c/en_au/',
    fundingCapacity: 'High',
    csrFocus: 'Networking Education, Tech Skills',
    contactName: 'Sustainability Team',
    email: 'csr@cisco.com',
    isReal: true,
  },
  {
    name: 'Suncorp Group',
    industry: 'Insurance & Finance',
    sector: 'Finance',
    size: 'Enterprise',
    location: 'Brisbane, QLD',
    website: 'https://www.suncorp.com.au',
    fundingCapacity: 'Medium',
    csrFocus: 'Community Education, Risk Management',
    contactName: 'Community Programs',
    email: 'community@suncorp.com.au',
    isReal: true,
  },
  {
    name: 'EnergyAustralia',
    industry: 'Energy',
    sector: 'Energy',
    size: 'Enterprise',
    location: 'Melbourne, VIC',
    website: 'https://www.energyaustralia.com.au',
    fundingCapacity: 'Medium',
    csrFocus: 'Renewable Energy, STEM Education',
    contactName: 'Sustainability Relations',
    email: 'sustainability@energyaustralia.com.au',
    isReal: true,
  },
];

async function seedCompanies() {
  console.log('🌱 Adding partner companies...');
  let added = 0;

  for (const company of PARTNER_COMPANIES) {
    const existing = await prisma.company.findUnique({
      where: { name: company.name },
    });
    if (!existing) {
      await prisma.company.create({ data: company });
      added++;
    }
  }

  console.log(`✅ Added ${added} new companies`);
}

seedCompanies()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
