const { Router } = require("express")
const router = Router()
const { registerUser, loginUser, logoutUser } = require("../controllers/userController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)

module.exports = router