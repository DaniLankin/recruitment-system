const express = require("express");
const prisma = require("../config/db");

const router = express.Router();

// 📥 יצירת מועמד חדש
router.post("/candidates", async (req, res) => {
  const { name, email, phone, resume } = req.body;

  try {
    const newCandidate = await prisma.candidate.create({
      data: { name, email, phone, resume },
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 קבלת כל המועמדים
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
