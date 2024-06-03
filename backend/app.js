const express = require("express");
const cookieParser = require("cookie-parser");
const { ErrorMiddleware } = require("./middlewares/error");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

// middleware for error
app.use(ErrorMiddleware);

module.exports = app;
