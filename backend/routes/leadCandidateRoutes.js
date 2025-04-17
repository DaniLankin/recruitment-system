
const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRecruiter = require("../middleware/requireRecruiter");

const router = express.Router();

// 📥 יצירת מועמד חדש ע"י מגייס
router.post("/lead-candidates", authMiddleware, requireRecruiter, async (req, res) => {
  const { firstName, lastName, email, phone, position, date, age, gender, experienceYears, resume } = req.body;

  try {
    const newLead = await prisma.leadCandidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        date: new Date(date),
        age: parseInt(age),
        gender,
        experienceYears: parseInt(experienceYears),
        resume
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error("שגיאה ביצירת מועמד:", error);
    res.status(500).json({ error: "שגיאה ביצירת מועמד" });
  }
});

module.exports = router;
