const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
// const { authenticateToken } = require("../middleware/authMiddleware");

// router.post("/register", authenticateToken, authController.register);

module.exports = router;
