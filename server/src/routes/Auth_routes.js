const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refresh", authController.refreshToken);

module.exports = router;
