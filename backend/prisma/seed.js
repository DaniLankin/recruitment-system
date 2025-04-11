const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // מנקה את הנתונים הקיימים
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // יצירת סיסמאות מוצפנות
  const candidatePassword = await bcrypt.hash("candidate123", 10);
  const recruiterPassword = await bcrypt.hash("recruiter123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  // יצירת משתמשים
  await prisma.user.createMany({
    data: [
      {
        name: "Candidate User",
        email: "candidate@example.com",
        password: candidatePassword,
        role: "candidate",
      },
      {
        name: "Recruiter User",
        email: "recruiter@example.com",
        password: recruiterPassword,
        role: "recruiter",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
      },
    ],
  });

  console.log("✅ Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
