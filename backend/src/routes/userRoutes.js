const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPasswordToken,
} = require("../controllers/userController");
const router = Router();

// routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/reset-password-token").post(resetPasswordToken)

module.exports = router;
