import UserModel from "../models/userModel.js";
import {
    signUpSchema,
    signInSchema,
    resetPasswordTokenSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from "../schemas/authSchema.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { mailer } from "../utils/mailer.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

// =================== Authentication Routes ===================

// Register a user
export const registerUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, password } = req.body;

    // validation of data
    await signUpSchema.validateAsync({ name, email, password });

    // check if the user already exists in the db or not
    const isExistingUser = await UserModel.findOne({ email });
    if (isExistingUser) {
        return next(new ErrorHandler("User is already registered", 400));
    }

    // create an entry for user in db
    const user = await UserModel.create({
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
    sendToken(user, res, 201, "User is registered successfully");
});

// Login a user
export const loginUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { email, password } = req.body;

    // validation of data
    await signInSchema.validateAsync({ email, password });

    // check if the user exists in the db or not
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // compare the user password and db password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return next(new ErrorHandler("Incorrect password", 401));
    }

    // remove the password (before sending it as response)
    user.password = undefined;

    // token, cookie and response functionality
    sendToken(user, res, 200, "User logged in successfully");
});

// Logout a user
export const logoutUser = AsyncHandler(async (req, res, next) => {
    // remove the cookie and send the response
    return res
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .status(200)
        .json({
            success: true,
            message: "User logged out successfully",
        });
});

// Reset password token
export const resetPasswordToken = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { email } = req.body;

    // validation of data
    await resetPasswordSchema.validateAsync({ email });

    // check if the user exists in the db or not
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // get the reset password token
    const token = user.generateResetPasswordToken();

    // save the token and token expiry to db
    await user.save({ validateBeforeSave: false });

    // create an url
    const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`;

    try {
        // send an email to the user
        await mailer(
            email,
            `Reset Password Link | Ecommerce`,
            `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`
        );

        // return the response
        return res.status(200).json({
            success: true,
            message: `Reset password link for ${email} has been sent successfully`,
        });
    } catch (err) {
        // remove the token and token expiry and save the changes
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        // return the response
        return next(new ErrorHandler(err.message, 500));
    }
});

// Reset password
export const resetPassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { password, confirmPassword } = req.body;

    // validation of data
    await resetPasswordSchema.validateAsync({ password, confirmPassword });

    // check if the password and confirm password matches or not
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // hash the reset password token to check it with db
    const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // validation of token
    const user = await UserModel.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandler("Invalid token or token has expired", 400)
        );
    }

    // update the new password and remove the token and token expiry
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
        `Reset password for ${user.email} is done successfully`
    );
});

// Change password
export const changePassword = AsyncHandler(async (req, res, next) => {
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
    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // check if old password and user password matches or not
    const isValidPassword = await user.comparePassword(oldPassword);
    if (!isValidPassword) {
        return next(new ErrorHandler("Incorrect password", 400));
    }

    // check if new password and confirm new password matches or not
    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler(
                "New password and confirm new password does not match",
                400
            )
        );
    }

    // update the new password
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

// =================== User Routes ===================

// Get user details
export const getUserDetails = AsyncHandler(async (req, res, next) => {
    // get the user id from request user (passed from auth middleware)
    const userId = req.user.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
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
export const updateUserProfile = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email } = req.body;

    // get the user id from request user (passed from auth middleware)
    const userId = req.user.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // update the user info
    await UserModel.findByIdAndUpdate(
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
        message: "Updated the user details successfully",
    });
});

// =================== Admin Routes ===================

// Get all users
export const getAllUsers = AsyncHandler(async (req, res, next) => {
    // find all the users present in db
    const users = await UserModel.find();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the users successfully",
        users,
    });
});

// Get a user
export const getAUser = AsyncHandler(async (req, res, next) => {
    // get the user id from request params
    const userId = req.params.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got the user successfully",
        user,
    });
});

// Delete a user
export const deleteAUser = AsyncHandler(async (req, res, next) => {
    // get the user id from request params
    const userId = req.params.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // delete the user
    await user.deleteOne();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Deleted the user successfully",
    });
});

// Update user role
export const updateUserRole = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, role } = req.body;

    // get the user id from request params
    const userId = req.params.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // update the user info
    await UserModel.findByIdAndUpdate(
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
