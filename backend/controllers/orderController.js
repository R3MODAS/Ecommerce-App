const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

// Create new order
exports.newOrder = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  // get the user id from req.user (passed from auth middleware)
  const userId = req.user.id;

  // validation of data
  if (
    !shippingInfo ||
    !orderItems ||
    !paymentInfo ||
    !itemsPrice ||
    !taxPrice ||
    !shippingPrice ||
    !totalPrice
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // create a new order entry in db
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: userId,
  });

  // return the response
  return res.status(201).json({
    success: true,
    message: "Order is created successfully",
    order,
  });
});
