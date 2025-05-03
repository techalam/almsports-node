
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

module.exports = router;
