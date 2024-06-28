import UserModel from "../models/userModel.js";
import { changePasswordSchema } from "../schemas/authSchemas/changePasswordSchema.js";
import { resetPasswordSchema } from "../schemas/authSchemas/resetPasswordSchema.js";
import { resetPasswordTokenSchema } from "../schemas/authSchemas/resetPasswordTokenSchema.js";
import { signInSchema } from "../schemas/authSchemas/signInSchema.js";
import { signUpSchema } from "../schemas/authSchemas/signUpSchema.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { mailer } from "../utils/mailer.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

// Register a user
export const registerUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, password } = req.body;

    // validation of data
    await signUpSchema.validateAsync({ name, email, password });

    // check if the user already exists in the db or not
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
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
    sendToken(user, res, 200, "User is registered successfully");
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
    // remove the cookie and return the response
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
    await resetPasswordTokenSchema.validateAsync({ email });

    // check if the user exists in the db or not
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // get the reset password token
    const token = user.generateResetPasswordToken();

    // save the changes for adding token and token expiry on db
    await user.save({ validateBeforeSave: false });

    // create an url for user to reset the password
    const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`;

    try {
        // send an email to reset the password
        await mailer(
            email,
            `Reset Password Link | Ecommerce`,
            `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`
        );

        // return the response
        return res.status(200).json({
            success: true,
            message: `Reset password link for ${email} has been sent successfully ✨`,
        });
    } catch (err) {
        // if the email is not sent successfully
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        // return the response
        return next(new ErrorHandler(err.message, 500));
    }
});

// Reset password
export const resetPassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { password, confirmPassword } = req.body;

    // get the reset password token from request params
    const resetPasswordToken = req.params.token;

    // validation of data
    await resetPasswordSchema.validateAsync({ password, confirmPassword });

    // check if the password and confirm password matches or not
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler(
                "Password and Confirm password does not match",
                400
            )
        );
    }

    // hash the reset password token
    const token = crypto
        .createHash("sha256")
        .update(resetPasswordToken)
        .digest("hex");

    // validation of token
    const user = await UserModel.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandler("Invalid token or token has expired", 401)
        );
    }

    // update the password and remove the token data
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    try {
        // send a mail to the user
        await mailer(
            user.email,
            `Reset Password Successful | Ecommerce`,
            `Password for ${user.email} is updated successfully`
        );

        // remove the password (before sending it as response)
        user.password = undefined;

        // token, cookie and response functionality
        sendToken(
            user,
            res,
            200,
            `Password for ${user.email} is updated successfully`
        );
    } catch (err) {
        // return the response
        return next(new ErrorHandler(err.message, 500));
    }
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

    // check if the old password and db password matches or not
    const isValidPassword = await user.comparePassword(oldPassword);
    if (!isValidPassword) {
        return next(new ErrorHandler("Incorrect password", 401));
    }

    // check if the new password and confirm new password matches or not
    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler(
                "New password and confirm new password does not match",
                400
            )
        );
    }

    // update the user password
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

    // get the user Id from request user (passed from auth middleware)
    const userId = req.user.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // update the user details
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
        message: "Updated the user profile successfully",
    });
});

// ====================== Admin Routes ====================== //

// Get all users (Admin)
export const getAllUsers = AsyncHandler(async (req, res, next) => {
    // find all the users
    const users = await UserModel.find();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the users successfully",
        users,
    });
});

// Get single user (Admin)
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
        message: "Got the user info successfully",
        user,
    });
});

// Delete user (Admin)
export const deleteAUser = AsyncHandler(async (req, res, next) => {
    // get the user id from request params
    const userId = req.params.id;

    // check if the user exists in the db or not
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User is not found", 400));
    }

    // delete the user from db
    await user.deleteOne();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Deleted the user successfully",
    });
});

// Update user role (Admin)
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

    // update the user details
    await UserModel.findByIdAndUpdate(
        userId,
        {
            name,
            email,
            role,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    // return the response
    return res.status(200).json({
        success: true,
        message: "Updated the user role successfully",
    });
});
