const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Middleware לוודא שזה משתמש עם role = admin
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only." });
  }
  next();
}

// 📊 סטטיסטיקות כלליות למנהל
router.get("/admin/stats", authMiddleware, requireAdmin, async (req, res) => {
  try {
    //console.log("🎯 req.user:", req.user);
    const [totalUsers, totalJobs, totalApplications, recruiters, candidates] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.count({ where: { role: "recruiter" } }),
      prisma.user.count({ where: { role: "candidate" } }),
    ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      recruiters,
      candidates,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📍 רשימת כל המשתמשים
router.get("/admin/users", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🗑️ מחיקת משתמש (למנהל בלבד)
router.delete("/admin/users/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
