const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRecruiter = require("../middleware/requireRecruiter"); 



const router = express.Router();

// 📥 הגשת מועמדות למשרה
router.post("/applications", authMiddleware, async (req, res) => {
    console.log("👉 Token payload:", req.user);

    const { jobId } = req.body;
  
    try {
      // בדיקה אם ההגשה כבר קיימת
      const existingApplication = await prisma.application.findFirst({
        where: {
          jobId,
          candidateId: req.user.userId,
        },
      });
  
      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied to this job.",
        });
      }
  
      // יצירת ההגשה
      const newApplication = await prisma.application.create({
        data: {
          jobId,
          candidateId: req.user.userId,
          status: "pending",
        },
      });
  
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 📄 קבלת כל ההגשות (כולל פרטי מועמד ומשרה)
router.get("/applications", authMiddleware, requireRecruiter, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        candidate: true,
        job: true
      }
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// מועמד מקבל את כל המועמדויות שהוא הגיש, כולל פרטי המשרה
router.get("/applications/by-candidate", authMiddleware, async (req, res) => {
  try {
    // מביא את כל ההגשות של המשתמש הנוכחי לפי ה־userId מתוך הטוקן
    const applications = await prisma.application.findMany({
      where: {
        candidateId: req.user.userId
      },
      include: {
        job: true // מצרף גם את פרטי המשרה לכל הגשה
      }
    });

    res.json(applications); // מחזיר את ההגשות למועמד
  } catch (error) {
    res.status(500).json({ error: error.message }); // במקרה של שגיאה
  }
});
// ✅ קבלת הגשות לפי מזהה משרה
router.get("/applications/by-job/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ error: "גישה אסורה" });
    }

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
    console.error("שגיאה בשליפת ההגשות:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// מגייס מקבל את כל המשרות שהוא פרסם, כולל ההגשות של מועמדים לכל משרה
router.get("/by-recruiter", authMiddleware, async (req, res) => {
  try {
    // מביא את כל המשרות שנוצרו ע"י המגייס הנוכחי
    const jobs = await prisma.job.findMany({
      where: {
        createdById: req.user.userId
      },
      include: {
        applications: {
          include: {
            candidate: true // מצרף את פרטי המועמד לכל הגשה
          }
        }
      }
    });

    res.json(jobs); // מחזיר את רשימת המשרות + ההגשות שלהן
  } catch (error) {
    res.status(500).json({ error: error.message }); // במקרה של שגיאה
  }
});

// 📊 מגייס - סטטיסטיקת מועמדויות לפי סטטוס (רק על משרות שהוא פרסם)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // מביא את כל המשרות של המגייס הנוכחי
    const jobs = await prisma.job.findMany({
      where: {
        createdById: req.user.userId
      },
      select: {
        id: true
      }
    });

    const jobIds = jobs.map((job) => job.id);

    // אם אין לו משרות בכלל
    if (jobIds.length === 0) {
      return res.json({
        pending: 0,
        accepted: 0,
        rejected: 0
      });
    }

    // סופר את כמות ההגשות לכל סטטוס
    const statuses = ["pending", "accepted", "rejected"];
    const counts = {};

    for (const status of statuses) {
      const count = await prisma.application.count({
        where: {
          jobId: { in: jobIds },
          status: status
        }
      });
      counts[status] = count;
    }

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🛠️ עדכון סטטוס מועמדות (רק למשתמשים מחוברים)
router.put("/applications/:id", authMiddleware, requireRecruiter, async (req, res) => {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;
  
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    try {
      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { status },
      });
  
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

module.exports = router;

