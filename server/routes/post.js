import { Router } from "express"
import { getFeedPosts, getUserPosts, likePost, createPost } from "../controllers/post.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js"

const router = Router()
router.get("/", auth, getFeedPosts);
router.post("/", auth, upload.single("picture"), createPost)
router.get("/:userId", auth, getUserPosts);
router.patch("/:id/like", auth, likePost);

export default router