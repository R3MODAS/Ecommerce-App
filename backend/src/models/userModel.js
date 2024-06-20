const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Schema for user
const userSchema = new mongoose.Schema(
  {
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
);

// Hashing the password
userSchema.pre("save", async function (next) {
  // if the password is not modified or new then don't hash it
  if (!this.isModified("password")) return next();

  // if the password is modified or new then hash it
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate jwt token
userSchema.methods.generateJWTToken = function () {
  // generate the token
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );

  // return the token
  return token;
};

// Compare the password
userSchema.methods.comparePassword = async function (password) {
  // compare the password and return the value (boolean)
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
