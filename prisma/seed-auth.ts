import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  // Create test users for development
  
  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@ese-school.edu.eg' },
    update: {},
    create: {
      email: 'admin@ese-school.edu.eg',
      name: 'System Administrator',
      role: 'CEO',
      segment: 'Whole',
      title: 'CEO',
      department: 'Executive',
      emailVerified: new Date(),
    },
  });
  
  // PC User
  await prisma.user.upsert({
    where: { email: 'pc@ese-school.edu.eg' },
    update: {},
    create: {
      email: 'pc@ese-school.edu.eg',
      name: 'People & Culture',
      role: 'PC',
      segment: 'Whole',
      title: 'HR Manager',
      department: 'Human Resources',
      emailVerified: new Date(),
    },
  });
  
  // Sample staff with different roles
  const staffMembers = [
    {
      email: 'lead@ese-school.edu.eg',
      name: 'Department Leader',
      role: 'LEAD' as const,
      segment: 'Language' as const,
      title: 'Department Head',
      department: 'Language Arts',
    },
    {
      email: 'teacher1@ese-school.edu.eg',
      name: 'English Teacher',
      role: 'STAFF' as const,
      segment: 'Language' as const,
      title: 'Teacher',
      department: 'English',
    },
    {
      email: 'teacher2@ese-school.edu.eg',
      name: 'Math Teacher',
      role: 'STAFF' as const,
      segment: 'International' as const,
      title: 'Teacher',
      department: 'Mathematics',
    }
  ];
  
  for (const staff of staffMembers) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        ...staff,
        emailVerified: new Date(),
      },
    });
  }
  
  console.log('✅ Users seeded successfully!');
}

async function main() {
  await seedUsers();
}

main()
  .catch((e) => {
    console.error('Error during auth seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
