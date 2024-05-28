const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        required: [true, "Please Enter your name"]
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User