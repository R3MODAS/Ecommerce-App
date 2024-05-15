import { Router } from "express"
import { getUser, getUserFriends, addRemoveFriends } from "../controllers/user.js"
import { auth } from "../middlewares/auth.js"

const router = Router()

router.get("/:id", auth, getUser)
router.get("/:id/friends", auth, getUserFriends)
router.patch("/:id/:friendId", auth, addRemoveFriends)

export default router