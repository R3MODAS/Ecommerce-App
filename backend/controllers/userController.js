const User = require("../models/userModel")
const AsyncHandler = require("../utils/asyncHandler")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/sendToken")

// Register a user
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

    // create a user entry in db
    const user = await User.create({
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

    // token and cookie functionality
    sendToken(user, res, 200, "User is registered successfully")
})