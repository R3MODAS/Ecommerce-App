const { Router } = require("express")
const router = Router()
const { registerUser, loginUser, logoutUser, resetPasswordToken, resetPassword } = require("../controllers/userController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/reset-password-token").post(resetPasswordToken)
router.route("/reset-password/:token").put(resetPassword)

module.exports = router