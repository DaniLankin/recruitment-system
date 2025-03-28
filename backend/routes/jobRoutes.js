const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ הוספת אימות
const requireRecruiter = require("../middleware/requireRecruiter"); 


const router = express.Router();

// 📌 קבלת כל המשרות (פתוח לכולם)
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 יצירת משרה (רק למשתמשים מחוברים)
router.post("/jobs", authMiddleware, requireRecruiter, async (req, res) => {
  const { title, description, company, location, salaryRange } = req.body;

  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        salaryRange,
        createdById: req.user.userId, // ✅ המשתמש המחובר
      },
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// חיפוש משרות לפי מילה בתיאור, כותרת או מיקום
router.get("/jobs/search", async (req, res) => {
  const { query } = req.query;

  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } }
        ]
      }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 חיפוש משרות לפי מילה (כותרת, תיאור, מיקום או שם חברה)
router.get("/jobs/search", async (req, res) => {
  const { query } = req.query;

  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } }
        ]
      }
    });

    res.json(jobs); // מחזיר את המשרות שתואמות לשאילתה
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📌 מחיקת משרה (רק למשתמשים מחוברים)
router.delete("/jobs/:id", authMiddleware, requireRecruiter, async (req, res) => {
  const jobId = parseInt(req.params.id);

  try {
    await prisma.job.delete({ where: { id: jobId } });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
