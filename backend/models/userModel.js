const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [4, "Name should have more than 4 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password should be greater than 8 characters"],
        trim: true
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
}, { timestamps: true })

// Hash Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generate JWT Token
userSchema.methods.generateJWTToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )
}

userSchema.methods.generateResetPasswordToken = function () {
    // generate a token
    const token = crypto.randomBytes(20).toString("hex")

    // hash the token and update the token
    this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // update the token expiry
    this.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000

    return token
}

module.exports = mongoose.model("User", userSchema)
