const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order