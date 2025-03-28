const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("🟢 Connected to the database"))
  .catch((err) => console.error("🔴 Database connection error:", err));

module.exports = prisma;
