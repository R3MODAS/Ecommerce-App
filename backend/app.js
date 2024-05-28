const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { errorMiddleware } = require("./middlewares/error")
const userRoute = require("./routes/userRoute")

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// routes
app.use("/api/v1", userRoute)

app.use(errorMiddleware)

module.exports = app