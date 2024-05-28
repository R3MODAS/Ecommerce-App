const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

module.exports = app