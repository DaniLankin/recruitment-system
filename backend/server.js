require("dotenv").config();
const express = require("express");
const cors = require("cors");
//const prisma = require("./config/db"); // 📌 חיבור למסד הנתונים
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // 📌 חיבור הנתיבים
app.use("/api", jobRoutes);
app.use("/api", candidateRoutes);
app.use("/api", applicationRoutes);
app.use("/api/recruiter", recruiterRoutes);
// סטטי – כדי שתוכל לגשת לקבצים מהדפדפן
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  res.send("Recruitment System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSIsImlhdCI6MTc0MjU0NTE3MiwiZXhwIjoxNzQyNTQ4NzcyfQ.vP3ihIXYs935ipP4FMQpmdnukLtssJVsUltquJiUUSQ"