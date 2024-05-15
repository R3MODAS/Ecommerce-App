import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"

// Configurations
const __filename = fileURLToPath(import.meta.url) // converts the url to path
const __dirname = path.dirname(__filename) // shows the current directory

const app = express()
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// Routes
app.get("/", (req,res) => {
    return res.status(200).json({
        success: true,
        message: "Hello and this works !"
    })
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts",postRoutes)

export default app