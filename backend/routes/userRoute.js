const { Router } = require("express")
const router = Router()

const { registerUser, loginUser, logoutUser, resetPasswordToken, resetPassword, getUserDetails, changePassword, updateUserProfile, getAllUsers, getSingleUserDetails, deleteUser, updateUserRole } = require("../controllers/userController")
const { auth, authorizeRoles } = require("../middlewares/auth")

// Authentication Routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)

router.route("/reset-password-token").post(resetPasswordToken)
router.route("/reset-password/:token").put(resetPassword)
router.route("/update-password").put(auth, changePassword)

router.route("/me").get(auth, getUserDetails)
router.route("/me/update").put(auth, updateUserProfile)

// Admin Routes
router.route("/admin/users").get(auth, authorizeRoles("admin"), getAllUsers)
router.route("/admin/user/:id")
    .get(auth, authorizeRoles("admin"), getSingleUserDetails)
    .put(auth, authorizeRoles("admin"), updateUserRole)
    .delete(auth, authorizeRoles("admin"), deleteUser)

module.exports = router