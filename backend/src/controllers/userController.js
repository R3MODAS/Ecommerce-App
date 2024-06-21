const User = require("../models/userModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const { signUpSchema } = require("../schemas/authSchemas/signUpSchema");
const { signInSchema } = require("../schemas/authSchemas/signInSchema");
const { resetPasswordTokenSchema } = require("../schemas/authSchemas/resetPasswordTokenSchema");
const { resetPasswordSchema } = require("../schemas/authSchemas/resetPasswordSchema");
const { changePasswordSchema } = require("../schemas/authSchemas/changePasswordSchema");
const sendToken = require("../utils/sendToken");
const mailer = require("../utils/mailer");
const crypto = require("crypto");

// Register a user
exports.registerUser = AsyncHandler(async (req, res, next) => {
   // get data from request body
   const { name, email, password } = req.body;

   // validation of data
   await signUpSchema.validateAsync({ name, email, password });

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
   const { name, email, password } = req.body;

   // validation of data
   await signInSchema.validateAsync({ email, password });

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
   const { email } = req.body;

   // validation of data
   await resetPasswordTokenSchema.validateAsync({ email });

   // check if the user exists in the db or not
   const user = await User.findOne({ email });
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // get the reset password token
   const token = user.generateResetPasswordToken();

   // save all the changes of token and token expiry
   await user.save({ validateBeforeSave: false });

   // create the url to send to the user
   const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`;

   try {
      // send the mail to the user
      await mailer(
         email,
         `Reset Password Link | Ecommerce`,
         `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`
      );

      // return the response
      return res.status(200).json({
         success: true,
         message: `Reset password link is sent to ${email} successfully`,
      });
   } catch (err) {
      // remove the token and token expiry
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();

      // return the response
      return next(new ErrorHandler(err.message, 500));
   }
});

// Reset password
exports.resetPassword = AsyncHandler(async (req, res, next) => {
   // get data from request body
   const { password, confirmPassword } = req.body;

   // validation of data
   await resetPasswordSchema.validateAsync({ password, confirmPassword });

   // check if the password and confirm password matches or not
   if (password !== confirmPassword) {
      return next(
         new ErrorHandler("Password and confirm password does not match", 400)
      );
   }

   // get the token from request params and hash it to validate it with the hashed token stored in the db
   const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

   // validation of token and token expiry
   const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
   });
   if (!user) {
      return next(new ErrorHandler("Invalid Token or token has expired", 400));
   }

   // update the password and also remove the token and token expiry from db and save the changes
   user.password = password;
   user.forgotPasswordToken = undefined;
   user.forgotPasswordTokenExpiry = undefined;
   await user.save();

   // remove the password (before sending it as response)
   user.password = undefined;

   // token, cookie and response functionality
   sendToken(
      user,
      res,
      200,
      `Reset password for ${email} is done successfully`
   );
});

// Change password
exports.changePassword = AsyncHandler(async (req, res, next) => {
   // get data from request body
   const { oldPassword, newPassword, confirmNewPassword } = req.body;

   // get the user id from request user (passed from auth middleware)
   const userId = req.user.id;

   // validation of data
   await changePasswordSchema.validateAsync({
      oldPassword,
      newPassword,
      confirmNewPassword,
   });

   // check if the user exists in the db or not
   const user = await User.findById(userId).select("+password");
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // check if the old password and db password matches or not
   const isValidPassword = await user.comparePassword(oldPassword);
   if (!isValidPassword) {
      return next(new ErrorHandler("Incorrect old password"));
   }

   // check if the new password and confirm new password matches or not
   if (newPassword !== confirmNewPassword) {
      return next(
         new ErrorHandler(
            "New password and Confirm New Password does not match",
            400
         )
      );
   }

   // update the new password in db
   user.password = newPassword;
   await user.save();

   // remove the password (before sending it as response)
   user.password = undefined;

   // token, cookie and response functionality
   sendToken(
      user,
      res,
      200,
      `Password for ${user.email} is updated successfully`
   );
});

// Get user details
exports.getUserDetails = AsyncHandler(async (req, res, next) => {
   // get user id from request user (passed from auth middleware)
   const userId = req.user.id;

   // check if the user exists in the db or not
   const user = await User.findById(userId);
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // return the response
   return res.status(200).json({
      success: true,
      message: "Got the user details successfully",
      user,
   });
});

// Update user profile
exports.updateUserProfile = AsyncHandler(async (req, res, next) => {
   // get data from request body
   const { name, email } = req.body;

   // get the user id from request user (passed from auth middleware)
   const userId = req.user.id;

   // check if the user exists in the db or not
   const user = await User.findById(userId);
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // update the user details
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

// ====================== Admin Routes ====================== //

// Get all users (Admin)
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

// Get single user (Admin)
exports.getSingleUser = AsyncHandler(async (req, res, next) => {
   // get the user id from request params
   const userId = req.params.id;

   // check if the user exists in the db or not
   const user = await User.findById(userId);
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // return the response
   return res.status(200).json({
      success: true,
      message: "Got the single user details successfully",
      user,
   });
});

// Delete user (Admin)
exports.deleteUser = AsyncHandler(async (req, res, next) => {
   // get the user id from request params
   const userId = req.params.id;

   // check if the user exists in the db or not
   const user = await User.findById(userId);
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // remove the user from db
   await user.deleteOne();

   // return the response
   return res.status(200).json({
      success: true,
      message: "Deleted the user successfully",
   });
});

// Update user role (Admin)
exports.updateUserRole = AsyncHandler(async (req, res, next) => {
   // get data from request body
   const { name, email, role } = req.body;

   // get the user id from request params
   const userId = req.params.id;

   // check if the user exists in the db or not
   const user = await User.findById(userId);
   if (!user) {
      return next(new ErrorHandler("User is not found", 400));
   }

   // update the role
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
      message: "Updated the user role successfully",
   });
});
