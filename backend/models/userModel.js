const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    trim: true,
    minLength: [4, "Name should be more than 4 characters"],
    maxLength: [30, "Name cannot exceed more than 30 characters"],
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
    minLength: [8, "Password should be greater than 8 characters"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
},
  { timestamps: true }
)

// Hashing the password
userSchema.pre("save", async function (next) {
  // if the password is not modified/new then move to new handler function
  if (!this.isModified("password")) return next()

  // if the password is modified/new then hash the password
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Generate jwt token
userSchema.methods.generateJWTToken = function () {
  // generate jwt token
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

// Compare password
userSchema.methods.comparePassword = async function (password) {
  // return the result if the password matches or not
  return await bcrypt.compare(password, this.password)
}

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  // generate the reset password token
  const resetToken = crypto.randomBytes(10).toString("hex")

  // hash the token and update the token in db
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  // update the token expiry in db
  this.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000

  // return the reset token
  return resetToken
}

const User = mongoose.model("User", userSchema)
module.exports = User