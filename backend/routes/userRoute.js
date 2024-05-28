const {Router} = require("express")
const router = Router()

const {registerUser} = require("../controllers/userController")

router.route("/register").post(registerUser)

module.exports = router