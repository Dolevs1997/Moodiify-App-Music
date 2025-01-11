const express = require("express");
const genre_controller = require("../controllers/genre_controller");
const router = express.Router();

router.get("/", genre_controller.getGenres);

module.exports = router;
