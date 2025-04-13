const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // ← זה הקובץ שיצרת בתיקיית config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // קבצי PDF
    allowed_formats: ["pdf"],
  },
});

const upload = multer({ storage });

module.exports = upload;
