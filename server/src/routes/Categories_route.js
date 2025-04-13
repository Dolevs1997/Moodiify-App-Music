const express = require("express");
const category_controller = require("../controllers/category_controller");
const CategoryRouter = express.Router();
const { authenticate } = require("../middlewares/auth_middleware");
const { validateToken } = require("../middlewares/SpotifyTokens");

CategoryRouter.get(
  "/",
  authenticate,
  validateToken,
  category_controller.getAll
);

module.exports = CategoryRouter;
