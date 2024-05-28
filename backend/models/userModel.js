const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        trim: true,
        minLength: [4, "Name should be more than 4 characters"],
        maxLength: [30, "Name cannot exceed more than 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        select: false,
        minLength: [8, "Password should be greater than 8 characters"]
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
}, { timestamps: true })

// Hashing the password
userSchema.pre("save", async function(next){
    // Only hash the password if it has been modified (or is new)
    if(!this.isModified("password")) return next()
    
    // hash the password if it is new or modified
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Generate a JWT token
userSchema.methods.generateJWTToken = function(){
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

const User = mongoose.model("User", userSchema)
module.exports = User