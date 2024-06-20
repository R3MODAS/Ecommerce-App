const User = require("../models/userModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const { signUpSchema } = require("../schemas/signUpSchema");
const { signInSchema } = require("../schemas/signInSchema")
const sendToken = require("../utils/sendToken");
const crypto = require("crypto");
const { resetPasswordTokenSchema } = require("../schemas/resetPasswordTokenSchema");
const mailer = require("../utils/mailer");

// Register a user
exports.registerUser = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { name, email, password } = req.body

  // validation of data
  await signUpSchema.validateAsync({ name, email, password })

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
  // get data from request body
  const { name, email, password } = req.body

  // validation of data
  await signInSchema.validateAsync({ email, password })

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
  // get data from request body
  const { email } = req.body

  // validation of data
  await resetPasswordTokenSchema.validateAsync({ email })

  // check if the user exists in the db or not
  const user = await User.findOne({ email })
  if (!user) {
    return next(new ErrorHandler("User is not found", 400))
  }

  // get the reset password token
  const token = user.generateResetPasswordToken()

  // save all the changes of token and token expiry
  await user.save({ validateBeforeSave: false })

  // create the url to send to the user
  const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`

  try {
    // send the mail to the user
    await mailer(email, `Reset Password Link | Ecommerce`, `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`);

    // return the response
    return res.status(200).json({
      success: true,
      message: `Reset password link is sent to ${email} successfully`
    })
  } catch (err) {
    // remove the token and token expiry
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    await user.save()

    // return the response
    return next(new ErrorHandler(err.message, 500))
  }
});

// Reset password
exports.resetPassword = AsyncHandler(async (req,res,next) => {
  
})