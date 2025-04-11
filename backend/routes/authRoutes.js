const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const router = express.Router();

// 📌 הרשמה של מועמד חדש
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "כתובת אימייל כבר קיימת במערכת" });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת המשתמש החדש
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "candidate", // ברירת מחדל – מועמד
      },
    });

    res.status(201).json({ message: "נרשמת בהצלחה" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📌 התחברות משתמש
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role // ✅ תפקיד המערכת: recruiter / candidate
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
