const { Router } = require("express")
const router = Router()
const { registerUser, loginUser, logoutUser, resetPasswordToken, resetPassword, getUserDetails } = require("../controllers/userController")

const { auth } = require("../middlewares/auth")

// Authentication
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/reset-password-token").post(resetPasswordToken)
router.route("/reset-password/:token").put(resetPassword)

// User actions
router.route("/me").get(auth, getUserDetails)

module.exports = router