const { Router } = require("express")
const router = Router()
const { registerUser, loginUser, logoutUser, resetPassword } = require("../controllers/userController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/reset-password").post(resetPassword)

module.exports = router