const express = require("express");
const category_controller = require("../controllers/category_controller");
const homeRouter = express.Router();
const { validateToken } = require("../middlewares/SpotifyTokens");
homeRouter.get("/categories", validateToken, category_controller.getAll);

module.exports = homeRouter;
