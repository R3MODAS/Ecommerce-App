const User = require("../models/userModel")
const { ErrorHandler } = require("../utils/errorHandler")
const { AsyncHandler } = require("../utils/asyncHandler")

// Register user
exports.registerUser = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { name, email, password } = req.body

    // validation of data
    if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400))
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

    // generate a JWT token
    const token = user.generateJWTToken()

    //  create an options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    // return the response
    return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User registered successfully",
        user, token
    })
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

    // generate a JWT token
    const token = user.generateJWTToken()

    // remove the password
    user.password = undefined

    //  create an options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    // return the response
    return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
        token
    })

})

// Logout user
exports.logoutUser = AsyncHandler(async (req,res,next) => {
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