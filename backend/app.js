const express = require("express")
const app = express()

const errorMiddleware = require("./middlewares/error")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Route Imports
const productRoute = require("./routes/productRoute")
const userRoute = require("./routes/userRoute")

app.use("/api/v1", productRoute)
app.use("/api/v1", userRoute)

// Middleware for Errors
app.use(errorMiddleware)

module.exports = app