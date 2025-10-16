import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create EOM Categories
  const categories = [
    { name: 'Outstanding Leadership', order: 1 },
    { name: 'Team Spirit', order: 2 },
    { name: 'Innovation', order: 3 },
    { name: 'Rising Star', order: 4 },
    { name: 'Service Excellence', order: 5 },
  ];

  console.log('Creating EOM categories...');
  for (const cat of categories) {
    await prisma.eomCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // Create MRE Rater Contexts
  const raterContexts = [
    { code: 'CEO', label: 'CEO' },
    { code: 'PC', label: 'People & Culture' },
    { code: 'MANAGER', label: 'Manager' },
    { code: 'PEER', label: 'Peer' },
    { code: 'QA', label: 'Quality Assurance' },
    { code: 'HOD', label: 'Head of Department' },
    { code: 'PRINCIPAL', label: 'Principal' },
    { code: 'SELF', label: 'Self' },
  ];

  console.log('Creating MRE rater contexts...');
  for (const ctx of raterContexts) {
    await prisma.mreRaterContext.upsert({
      where: { code: ctx.code },
      update: {},
      create: ctx,
    });
  }

  // Create MRE Domains
  const domains = [
    { code: 'PROFESSIONALISM', label: 'Professionalism' },
    { code: 'COMMUNICATION', label: 'Communication' },
    { code: 'COLLABORATION', label: 'Collaboration' },
    { code: 'INNOVATION', label: 'Innovation' },
    { code: 'RESULTS', label: 'Results Orientation' },
  ];

  console.log('Creating MRE domains...');
  for (const dom of domains) {
    await prisma.mreDomain.upsert({
      where: { code: dom.code },
      update: {},
      create: dom,
    });
  }

  // Create Admin User (CEO)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ese-school.edu.eg';
  console.log(`Creating admin user: ${adminEmail}...`);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'System Administrator',
      role: 'CEO',
      segment: 'Whole',
      title: 'CEO',
      department: 'Executive',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create P&C User
  const pcUser = await prisma.user.upsert({
    where: { email: 'pc@ese-school.edu.eg' },
    update: {},
    create: {
      email: 'pc@ese-school.edu.eg',
      name: 'People & Culture',
      role: 'PC',
      segment: 'Whole',
      title: 'HR Manager',
      department: 'Human Resources',
    },
  });

  console.log(`✅ P&C user created: ${pcUser.email}`);

  // Create sample staff
  const sampleStaff = [
    {
      email: 'manager@ese-school.edu.eg',
      name: 'Department Manager',
      role: 'LEAD' as const,
      segment: 'Language' as const,
      title: 'Department Head',
      department: 'Language Arts',
    },
    {
      email: 'teacher@ese-school.edu.eg',
      name: 'Sample Teacher',
      role: 'STAFF' as const,
      segment: 'International' as const,
      title: 'Teacher',
      department: 'Science',
    },
  ];

  console.log('Creating sample staff...');
  for (const staff of sampleStaff) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }

  // Create default settings
  console.log('Creating default settings...');
  await prisma.settings.upsert({
    where: { key: 'branding' },
    update: {},
    create: {
      key: 'branding',
      valueJson: {
        logo: '/ese-logo.png',
        colors: {
          blues: ['#094773', '#23547B', '#485D7B', '#2D7EA1', '#67A1BA', '#9DC6E1', '#869FC9'],
          greens: ['#2C5B4C', '#5D7D60', '#487557', '#7CA48A', '#8EB49B', '#E5F6DF', '#86C997', '#D1DCCD'],
        },
        fonts: {
          body: 'Quicksand',
          heading: 'Playfair Display',
        },
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log(`   Admin: ${adminEmail}`);
  console.log(`   P&C: pc@ese-school.edu.eg`);
  console.log('\n💡 Use magic link authentication (check server logs for dev links)');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
