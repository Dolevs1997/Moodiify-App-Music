const express = require("express");
const category_controller = require("../controllers/category_controller");
const CategoryRouter = express.Router();
const { validateToken } = require("../middlewares/SpotifyTokens");
CategoryRouter.get("/", validateToken, category_controller.getAll);

module.exports = CategoryRouter;
