import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        trim: true,
        minLength: [3, "Name must be atleast 3 characters"],
        maxLength: [30, "Name must not exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        trim: true,
        minLength: [8, "Password must be atleast 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
}, { timestamps: true })

// Hashing the password
userSchema.pre("save", async function (next) {
    // if the password is not modified or new then don't hash it
    if (!this.isModified("password")) return next()

    // if the password is modified or new then hash it and store it in db
    this.password = await bcrypt.hash(this.password, 10)

    // move to next handler function
    next()
})

// Generating the jwt token
userSchema.methods.generateJWTToken = function () {
    // generate a token
    const token = jwt.sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )

    // return the token
    return token
}

// Comparing the password
userSchema.methods.comparePassword = async function (password) {
    // return the value (true/false)
    return await bcrypt.compare(password, this.password)
}

// Generating the reset password token
userSchema.methods.generateResetPasswordToken = function () {
    // generate the token
    const token = crypto.randomBytes(20).toString("hex")

    // hash the token and store it on the db
    this.forgotPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    // store the token expiry on db
    this.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000

    // return the token
    return token
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel