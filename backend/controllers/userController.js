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

    // validation of data
    if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // check if the user already exists in the db or not
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new ErrorHandler("User is already registered", 400))
    }

    // create a new user
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
    sendToken(user, 200, res, "User registered successfully")

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
        return next(new ErrorHandler("User is not found", 401))
    }

    // check if the password matches with the db password or not
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect email or password", 401))
    }
    // remove the password
    user.password = undefined

    // token and cookie functionality
    sendToken(user, 200, res, "User logged in successfully")

})

// Logout user
exports.logoutUser = AsyncHandler(async (req, res, next) => {
    // remove the cookie value
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

    // get reset password token
    const token = user.generateResetPasswordToken()

    // store the token and token expiry in db
    await user.save({ validateBeforeSave: false })

    // create an url with token and sent it to the user
    const url = `${req.protocol}://${req.get("host")}/reset-password/${token}`

    // send the mail to the user
    try {
        await mailer(email, `Reset Password Link | Ecommerce`, `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${url}.\n If you have not requested this, kindly ignore.`)

        // return the response
        return res.status(200).json({
            success: true,
            message: `Reset password link has been sent to ${email} successfully`
        })
    } catch (err) {
        // if sending mail fails then we will remove the token and token expiry
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save()

        return next(new ErrorHandler(err.message, 500))
    }

})

// Reset password
exports.resetPassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { password, confirmPassword } = req.body

    // validation of the data
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

    // validation of token and token expiry
    const user = await User.findOne(
        {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        })
    if (!user) {
        return next(new ErrorHandler("Invalid Token or Token has expired", 401))
    }

    // update the password and remove the token and token expiry from db
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    await user.save()

    // remove the password 
    user.password = undefined

    // token and cookie functionality
    sendToken(user, 200, res, "Password reset done successfully")

})

// Get user Details
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

// Update user password
exports.updatePassword = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    // get the user id from req.user (passed from auth middleware)
    const userId = req.user.id

    // find the user using the id
    const user = await User.findById(userId).select("+password")

    // check if the old password and password in db matches or not
    const comparePassword = await user.comparePassword(oldPassword)
    if (!comparePassword) {
        return next(new ErrorHandler("Old password is incorrect", 400))
    }

    // check if new password and confirm new password matches or not
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New password does not match", 400))
    }

    // update the password with the new password
    user.password = newPassword
    await user.save()

    // token and cookie functionality
    sendToken(user, 200, res, 'Got the user details successfully')
})