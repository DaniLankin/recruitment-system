const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRecruiter = require("../middleware/requireRecruiter");
const requireCandidate = require("../middleware/requireCandidate");

const router = express.Router();

// Cloudinary
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// הגדרת Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// אחסון ב־Cloudinary רק לקבצי PDF
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    allowed_formats: ["pdf"],
    resource_type: "raw", // קבצים שאינם תמונות
    disposition: "attachment", // ⬅️ בקשה להוריד את הקובץ במקום להציג אותו
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// 📥 הגשת מועמדות עם קובץ קו״ח PDF
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
        return res.status(400).json({ error: "כבר הגשת למשרה זו" });
      }

      const newApp = await prisma.application.create({
        data: {
          jobId: parseInt(jobId),
          candidateId: req.user.userId,
          status: "pending",
          resume: req.file.path, // קישור ל־Cloudinary
        },
      });

      res.status(201).json(newApp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "שגיאה בהגשה" });
    }
  }
);

// 🔍 כל ההגשות - מגייס בלבד
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

// 📄 הגשות לפי מועמד (מועמד רואה את ההגשות שלו)
router.get("/applications/by-candidate", authMiddleware, requireCandidate, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user.userId },
      include: { job: true },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 הגשות לפי משרה מסוימת (רק למגייס)
router.get("/applications/by-job/:jobId", authMiddleware, requireRecruiter, async (req, res) => {
  const { jobId } = req.params;

  try {
    const apps = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשליפת הגשות" });
  }
});

// ✅ עדכון סטטוס מועמדות (רק מגייס)
router.put("/applications/:id", authMiddleware, requireRecruiter, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בעדכון סטטוס" });
  }
});

// ❌ מחיקת מועמדות (רק למגייס)
router.delete("/applications/:id", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.application.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "המועמדות נמחקה בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקה:", error);
    res.status(500).json({ error: "שגיאה במחיקת מועמדות" });
  }
});

module.exports = router;
