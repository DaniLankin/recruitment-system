const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const candidatePassword = await bcrypt.hash('candidate123', 10);
  const recruiterPassword = await bcrypt.hash('recruiter123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin"
      }
    ]
  });

  console.log("✅ All users (candidate, recruiter, admin) inserted successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
