import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
