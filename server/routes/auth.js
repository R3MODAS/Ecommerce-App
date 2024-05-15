import { Router } from "express"
import { upload } from "../middlewares/multer.js"
import { login, register } from "../controllers/auth.js"
const router = Router()

router.post("/register", upload.single("picture"), register)
router.post("/login", login)

export default router