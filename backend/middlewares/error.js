const ErrorHandler = require("../utils/errorHandler");

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Invalid jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `JWT is invalid, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Jwt expiry error
  if (err.name === "TokenExpiredError") {
    const message = `JWT has expired, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  // return the response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { errorMiddleware };
