const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ error: "גישה אסורה" });
    }

    const recruiterId = req.user.userId;

    const [jobs, applications, lastJob] = await Promise.all([
      prisma.job.findMany({ where: { createdById: recruiterId } }),
      prisma.application.findMany({
        where: {
          job: {
            createdById: recruiterId,
          },
        },
      }),
      prisma.job.findFirst({
        where: { createdById: recruiterId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const statusCount = {
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });

    res.json({
      totalJobs: jobs.length,
      totalApplications: applications.length,
      statusCount,
      lastJob,
    });
  } catch (err) {
    console.error("שגיאה בדשבורד:", err);
    res.status(500).json({ error: "שגיאה בשליפת נתוני הדשבורד" });
  }
});

module.exports = router;
