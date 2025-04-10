const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRecruiter = require("../middleware/requireRecruiter");
const requireCandidate = require("../middleware/requireCandidate");
const upload = require("../middleware/uploadResume");

const router = express.Router();

// 📥 הגשת מועמדות למשרה עם קובץ PDF
router.post(
  "/applications",
  authMiddleware,
  requireCandidate,
  upload.single("resume"),
  async (req, res) => {
    const { jobId } = req.body;

    try {
      const existing = await prisma.application.findFirst({
        where: {
          jobId: parseInt(jobId),
          candidateId: req.user.userId,
        },
      });

      if (existing) {
        return res.status(400).json({ error: "כבר הגשת מועמדות למשרה זו" });
      }

      const newApplication = await prisma.application.create({
        data: {
          jobId: parseInt(jobId),
          candidateId: req.user.userId,
          status: "pending",
          resume: req.file?.filename || null,
        },
      });

      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 📄 קבלת כל ההגשות (מגייס)
router.get("/applications", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        candidate: true,
        job: true,
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👤 קבלת הגשות של מועמד מחובר
router.get("/applications/by-candidate", authMiddleware, requireCandidate, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        candidateId: req.user.userId,
      },
      include: {
        job: true,
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 קבלת הגשות לפי מזהה משרה (למגייס)
router.get("/applications/by-job/:jobId", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await prisma.application.findMany({
      where: {
        jobId: parseInt(jobId),
      },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// 🔢 קבלת משרות מגייס כולל ההגשות
router.get("/by-recruiter", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        createdById: req.user.userId,
      },
      include: {
        applications: {
          include: {
            candidate: true,
          },
        },
      },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 סטטיסטיקת סטטוסים למגייס
router.get("/stats", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        createdById: req.user.userId,
      },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);
    if (jobIds.length === 0) {
      return res.json({ pending: 0, accepted: 0, rejected: 0 });
    }

    const statuses = ["pending", "accepted", "rejected"];
    const counts = {};

    for (const status of statuses) {
      const count = await prisma.application.count({
        where: {
          jobId: { in: jobIds },
          status,
        },
      });
      counts[status] = count;
    }

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📝 עדכון סטטוס של מועמדות
router.put("/applications/:id", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.application.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בעדכון סטטוס" });
  }
});

module.exports = router;
