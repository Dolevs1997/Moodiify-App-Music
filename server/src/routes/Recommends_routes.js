const express = require("express");
const recommends_controller = require("../controllers/recommends_controller");
const RecommendRouter = express.Router();
const { validateToken } = require("../middlewares/SpotifyTokens");
const { authenticate } = require("../middlewares/auth_middleware");
RecommendRouter.get(
  "/",
  authenticate,
  validateToken,
  recommends_controller.getAll
);
module.exports = RecommendRouter;
