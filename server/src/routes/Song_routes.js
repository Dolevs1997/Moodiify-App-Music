const express = require("express");
const router = express.Router();
const songController = require("../controllers/song_controller");
const { authenticate } = require("../middlewares/auth_middleware");
router.get("/", authenticate, songController.getById);

module.exports = router;
