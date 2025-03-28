const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // סיסמאות מוצפנות
  const recruiterPassword = await bcrypt.hash("recruiter123", 10);
  const candidatePassword = await bcrypt.hash("candidate123", 10);

  // יצירת משתמשים
  await prisma.user.createMany({
    data: [
      {
        name: 'Recruiter User',
        email: 'recruiter@example.com',
        password: recruiterPassword,
        role: 'recruiter',
      },
      {
        name: 'Candidate User',
        email: 'candidate@example.com',
        password: candidatePassword,
        role: 'candidate',
      },
    ],
  });
}

main()
  .then(() => {
    console.log('✅ Users seeded successfully!');
  })
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
