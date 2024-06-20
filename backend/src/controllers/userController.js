const User = require("../models/userModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const crypto = require("crypto");
const { signUpSchema, signInSchema } = require("../utils/validateSchema");
const sendToken = require("../utils/sendToken");

// Register a user
exports.registerUser = AsyncHandler(async (req, res, next) => {
  // validation of data
  const { name, email, password } = await signUpSchema.validateAsync(req.body);

  // check if the user is already registered in the db or not
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    return next(new ErrorHandler("User is already registered", 400));
  }

  //  create a user for entry in db
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: email,
      url: "profilepicUrl",
    },
  });

  // remove the password (before sending it as response)
  user.password = undefined;

  // token, cookie and response functionality
  sendToken(user, res, 200, "User is registered successfully");
});

// Login a user
exports.loginUser = AsyncHandler(async (req, res, next) => {
  // validation of data
  const { email, password } = await signInSchema.validateAsync(req.body);

  // check if the user exists in the db or not
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User is not registered", 400));
  }

  // check if the password is valid or not
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return next(new ErrorHandler("Incorrect password", 400));
  }

  // remove the password (before sending it as response)
  user.password = undefined;

  // token, cookie and response functionality
  sendToken(user, res, 200, "User logged in successfully");
});

// Logout a user
exports.logoutUser = AsyncHandler(async (req, res, next) => {
  // remove the cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// Reset password token
exports.resetPasswordToken = AsyncHandler(async (req, res, next) => {
    
});
