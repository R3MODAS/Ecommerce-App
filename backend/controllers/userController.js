const User = require("../models/userModel")
const { ErrorHandler } = require("../utils/errorHandler")
const { AsyncHandler } = require("../utils/asyncHandler")
const mailer = require("../utils/mailer")
const crypto = require("crypto")
const sendToken = require("../utils/sendToken")

// Register user
exports.registerUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, password } = req.body

    // validation of the data
    if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // check if the user already exists in the db or not
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new ErrorHandler("User is already registered", 400))
    }

    // create an entry for user in db
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: email,
            url: "profilepicUrl"
        }
    })

    // remove the password
    user.password = undefined

    // token and cookie functionality
    sendToken(user, 200, res, "User is registered successfully")
})

// Login user
exports.loginUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { email, password } = req.body

    // validation of data
    if (!email || !password) {
        return next(new ErrorHandler("Email or Password is required", 400))
    }

    // check if the user exists in the db or not
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("User is not found", 400))
    }

    // compare the user password and db password
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect email or password", 400))
    }

    // remove the password
    user.password = undefined

    // token and cookie functionality
    sendToken(user, 200, res, "User logged in successfully")
})

// Logout user
exports.logoutUser = AsyncHandler(async (req, res, next) => {
    // set the cookie value to null 
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    // return the response
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

// Reset password token
exports.resetPasswordToken = AsyncHandler(async (req, res, next) => {
    // get email from request body
    const { email } = req.body

    // validation of data
    if (!email) {
        return next(new ErrorHandler("Email is required", 400))
    }

    // check if the user exists in the db or not
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("User is not found", 400))
    }

    // get the reset password token
    const token = user.generateResetPasswordToken()

    // store the token and token expiry to db
    await user.save({ validateBeforeSave: false })

    // create an url to send to user
    const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`

    // send a mail to the user
    try {
        await mailer(email, `Reset Password Link | Ecommerce`, `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`)

        // return the response
        return res.status(200).json({
            success: true,
            message: `Reset password link has been sent to ${email} successfully`,
            token
        })
    } catch (err) {
        // remove the token and token expiry if the mail is not sent
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save()

        return next(new ErrorHandler(err.message, 500))
    }

})

// Reset password
exports.resetPassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { password, confirmPassword } = req.body

    // validation of data
    if (!password || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // check if password and confirm password matches or not
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }

    // get the token from request params and hash it
    const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    // validation of token
    const user = await User.findOne({
        forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler("Invalid token or token has expired", 401))
    }

    // update the password and remove the token and token expiry
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    await user.save()

    // token and cookie functionality
    sendToken(user, 200, res, "Password reset done successfully")

})

// Get user details
exports.getUserDetails = AsyncHandler(async (req, res, next) => {
    // get the user id from req.user (passed from auth middleware)
    const userId = req.user.id

    // find the user using the id
    const user = await User.findById(userId)

    // return the response
    return res.status(200).json({
        success: true,
        message: 'Got the user details successfully',
        user
    })
})

// Change password
exports.changePassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    // validation of data
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // get the user id from req.user (passed from auth middleware)
    const userId = req.user.id

    // get the user using the user id
    const user = await User.findById(userId).select("+password")

    // check if the new password and confirm new password matches or not
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }

    // check if old password and db password matches or not
    const isPasswordMatch = await user.comparePassword(oldPassword)
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect old password", 400))
    }

    // update the password
    user.password = newPassword
    await user.save()

    // token and cookie functionality
    sendToken(user, 200, res, 'Password is updated successfully')
})

// Update user profile
exports.updateUserProfile = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email } = req.body

    // validation of data
    if (!name || !email) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // get the user id from req.user (passed from auth middleware)
    const userId = req.user.id

    // update the data
    await User.findByIdAndUpdate(
        { _id: userId },
        {
            name,
            email
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    )

    // return the response
    return res.status(200).json({
        success: true,
        message: "Updated the user profile successfully"
    })
})

// Get all users (Admin)
exports.getAllUsers = AsyncHandler(async (req, res, next) => {
    // get all the users
    const users = await User.find()

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the users successfully",
        users
    })
})

// Get single user details (Admin)
exports.getSingleUserDetails = AsyncHandler(async (req, res, next) => {
    // get user id from request params
    const userId = req.params.id

    // check if the user exists in the db or not
    const user = await User.findById(userId)
    if (!user) {
        return next(new ErrorHandler("User is not found", 400))
    }

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got the single user details successfully",
        user
    })

})

// Update user role (Admin)
exports.updateUserRole = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, role } = req.body

    // get the user id from request params
    const userId = req.params.id

    // check if the user exists in the db or not
    const user = await User.findById(userId)
    if (!user) {
        return next(new ErrorHandler("User is not found", 400))
    }

    // update the data
    await User.findByIdAndUpdate(
        { _id: userId },
        {
            name,
            email,
            role
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    )

    // return the response
    return res.status(200).json({
        success: true,
        message: "Updated the role successfully"
    })
})

// Delete user (Admin)
exports.deleteUser = AsyncHandler(async (req, res, next) => {
    // get the user id from request params
    const userId = req.params.id

    // check if the user exists in the db or not
    const user = await User.findById(userId)
    if (!user) {
        return next(new ErrorHandler("User is not found", 400))
    }

    // delete the user
    await user.deleteOne()

    // return the response
    return res.status(200).json({
        success: true,
        message: "Deleted the user successfully"
    })
})