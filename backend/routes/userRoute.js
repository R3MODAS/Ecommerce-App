const { Router } = require("express")
const router = Router()
const { registerUser, loginUser } = require("../controllers/userController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

module.exports = router