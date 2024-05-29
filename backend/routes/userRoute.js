const { Router } = require("express")
const router = Router()

const { registerUser, loginUser, logoutUser, resetPasswordToken, resetPassword, changePassword, getUserDetails, updateUserProfile, getAllUsers, getSingleUser, deleteUser, updateUserRole } = require("../controllers/userController")
const { auth, authorizeRoles } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)

router.route("/reset-password-token").post(resetPasswordToken)
router.route("/reset-password/:token").put(resetPassword)
router.route("/update-password").put(auth, changePassword)

// ********************************************************************************************************
//                                      User routes
// ********************************************************************************************************

router.route("/me").get(auth, getUserDetails)
router.route("/me/update").put(auth, updateUserProfile)

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************
router.route("/admin/users").get(auth, authorizeRoles("admin"), getAllUsers)
router.route("/admin/user/:id")
    .get(auth, authorizeRoles("admin"), getSingleUser)
    .delete(auth, authorizeRoles("admin"), deleteUser)
    .put(auth, authorizeRoles("admin"), updateUserRole)

module.exports = router