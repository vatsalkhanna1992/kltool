const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer  = require('multer')
const path = require("path");
const vision = require("../utils/vision");
const fileUploadPath = path.join(__dirname, "../../public") + "/vision/uploads";

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: File upload only supports images!');
    }
  }
}).single('upload_image');

router.get("/kltool-vision", auth, async (req, res) => {
  res.render("vision");
});

router.post("/kltool-vision", auth, async (req, res) => {
  const username = req.user.username;
  upload(req, res, async (err) => {
    if (err) {
      return res.send(err);
    }
    if (req.file == undefined) {
      return res.render("vision", {
        error: "No file selected!"
      });
    }
    const textFromImage = await vision.getTextFromImage(fileUploadPath + '/' + req.file.filename);
    res.render("vision", {
      textFromImage: textFromImage,
    });
  });
});

module.exports = router;