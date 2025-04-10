const multer = require("multer");
const path = require("path");

// הגדרת אחסון
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // תקייה מקומית
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// סינון קבצים - רק PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("קובץ חייב להיות PDF בלבד"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
