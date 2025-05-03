const express = require("express");
const category_controller = require("../controllers/category_controller");
const CategoryRouter = express.Router();
const { authenticate } = require("../middlewares/auth_middleware");
const { validateToken } = require("../middlewares/SpotifyTokens");

CategoryRouter.get(
  "/getAll",
  authenticate,
  validateToken,
  category_controller.getAll
);

CategoryRouter.get(
  "/category",
  authenticate,
  validateToken,
  category_controller.getById
);

module.exports = CategoryRouter;
