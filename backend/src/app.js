// Imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { ErrorMiddleware } = require("./middlewares/error");
const userRoutes = require("./routes/userRoutes");

// Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cookieParser());

// Routes
app.use("/api/v1", userRoutes);

// Error middleware
app.use(ErrorMiddleware);

// Exports
module.exports = app;
