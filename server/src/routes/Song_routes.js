const express = require("express");
const router = express.Router();
const multer = require("multer");
const songController = require("../controllers/song_controller");
const { authenticate } = require("../middlewares/auth_middleware");

const upload = multer(); // For parsing multipart/form-data

// Existing route
router.get("/", authenticate, songController.getById);

// New route for recognition
router.post(
  "/recognize-audio",
  authenticate,
  upload.single("file"),
  songController.recognizeAudio
);

module.exports = router;
