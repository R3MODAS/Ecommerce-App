const User = require("../models/userModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const mailer = require("../utils/mailer");
const sendToken = require("../utils/sendToken");
const crypto = require("crypto");

// Register user
exports.registerUser = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { name, email, password } = req.body

  // validation of data
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400))
  }

  // check if the user already exists in the db or not
  let user = await User.findOne({ email })
  if (user) {
    return next(new ErrorHandler("User is already registered", 400))
  }

  // create a new user entry in db
  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: email,
      url: "profilepicUrl"
    }
  })

  // remove the password (before sending it as response)
  user.password = undefined

  // token, cookie and sending response functionality
  sendToken(user, res, 200, "User is registered successfully")

})

// Login user
exports.loginUser = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { email, password } = req.body

  // validation of data
  if (!email || !password) {
    return next(new ErrorHandler("All fields are required", 400))
  }

  // check if the user exists in the db or not
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    return next(new ErrorHandler("User is not registered", 401))
  }

  // compare the user password and db password
  const isValidPassword = await user.comparePassword(password)
  if (!isValidPassword) {
    return next(new ErrorHandler("Password does not match", 401))
  }

  // remove the password (before sending it as response)
  user.password = undefined

  // token, cookie and sending response functionality
  sendToken(user, res, 200, "User logged in successfully")
})

// Logout user
exports.logoutUser = AsyncHandler(async (req, res, next) => {
  // remove the cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  // return the response
  return res.status(200).json({
    success: true,
    message: "User logged out successfully"
  })
})

// Reset Password Token
exports.resetPasswordToken = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { email } = req.body

  // validation of data
  if (!email) {
    return next(new ErrorHandler("Email is required", 400))
  }

  // check if the user exists in the db or not
  const user = await User.findOne({ email })
  if (!user) {
    return next(new ErrorHandler("User is not registered", 401))
  }

  // get the reset token
  const token = user.generateResetPasswordToken()

  // save the updates of token and token expiry in db
  await user.save({ validateBeforeSave: false })

  // create a url to send to user
  const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`

  try {
    // send the mail to user
    await mailer(email, `Reset Password Link | Ecommerce`, `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`);

    // return the response
    return res.status(200).json({
      success: true,
      message: `Reset password link has been sent to ${email} successfully`,
      token
    })
  }
  catch (err) {
    // remove the token and token expiry from db
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    await user.save()

    // return the error
    return next(new ErrorHandler(err.message, 500))
  }
})

// Reset Password
exports.resetPassword = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { password, confirmPassword } = req.body

  // validation of data
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400))
  }

  // check if password and confirm password matches or not
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password does not match", 400))
  }

  // hash the token we got from request params
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  // validation of token
  const user = await User.findOne({
    forgotPasswordToken: token,
    forgotPasswordTokenExpiry: { $gt: Date.now() }
  })
  if (!user) {
    return next(new ErrorHandler("Invalid Token or Token has expired", 401))
  }

  // update the new password
  user.password = password
  user.forgotPasswordToken = undefined
  user.forgotPasswordTokenExpiry = undefined
  await user.save()

  // remove the password (before sending it as response)
  user.password = undefined

  // token, cookie and sending response functionality
  sendToken(user, res, 200, `Reset Password for ${user.email} done successfully`)
})

// Change Password
exports.changePassword = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { oldPassword, newPassword, confirmNewPassword } = req.body

  // validation of data
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("All fields are required", 400))
  }

  // get the user id from req.user (passed from auth middleware)
  const userId = req.user.id

  // get the user details
  const user = await User.findById(userId).select("+password")
  if (!user) {
    return next(new ErrorHandler("User is not found", 401))
  }

  // check if old password and db password matches or not
  const isValidPassword = await user.comparePassword(oldPassword)
  if (!isValidPassword) {
    return next(new ErrorHandler("Incorrect Password", 401))
  }

  // check if new password and confirm new password matches or not
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Password does not match", 401))
  }

  // update the password in db
  user.password = newPassword
  await user.save()

  // token, cookie and sending response functionality
  sendToken(user, res, 200, `Password for ${user.email} is updated successfully`)
})

// Get User Details
exports.getUserDetails = AsyncHandler(async (req, res, next) => {
  // get user id from req.user (passed from auth middleware)
  const userId = req.user.id;

  // get the user details
  const user = await User.findById(userId);

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the user details successfully",
    user,
  });
});

// Update User Profile
exports.updateUserProfile = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { name, email } = req.body;

  // get user id from req.user (passed from auth middleware)
  const userId = req.user.id;

  // update the data in db
  await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // return the response
  return res.status(200).json({
    success: true,
    message: "Updated the user profile successfully",
  });
});

// Get all Users (Admin)
exports.getAllUsers = AsyncHandler(async (req, res, next) => {
  // get all the users
  const users = await User.find();

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got all the users successfully",
    users,
  });
});

// Get Single User (Admin)
exports.getSingleUser = AsyncHandler(async (req, res, next) => {
  // get user id from request params
  const userId = req.params.id;

  // check if the user exists in the db or not
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User is not found", 401));
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the single user details successfully",
    user,
  });
});

// Delete User (Admin)
exports.deleteUser = AsyncHandler(async (req, res, next) => {
  // get user id from request params
  const userId = req.params.id;

  // check if the user exists in the db or not
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User is not found", 401));
  }

  // remove the user
  await user.deleteOne();

  // return the response
  return res.status(200).json({
    success: true,
    message: "User is deleted successfully",
  });
});

// Update user role (Admin)
exports.updateUserRole = AsyncHandler(async (req, res, next) => {
  // get data from request boyd
  const { name, email, role } = req.body;

  // get the user id from request params
  const userId = req.params.id;

  // check if the user exists in the db or not
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User is not found", 401));
  }

  // update the data
  await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      role,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // return the response
  return res.status(200).json({
    success: true,
    message: "Updated the role successfully",
  });
});
