const express = require("express");
const router = express.Router();
const songController = require("../controllers/song_controller");

router.get("/", songController.getById);

module.exports = router;
