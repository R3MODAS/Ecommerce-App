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

// Get single order
exports.getSingleOrder = AsyncHandler(async (req, res, next) => {
  // get order id using request params
  const orderId = req.params.id;

  // check if the order exists in the db or not
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) {
    return new ErrorHandler("Order is not found", 400);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the order details successfully",
    order,
  });
});

// Get logged in user orders
exports.myOrders = AsyncHandler(async (req, res, next) => {
  // get user id using req.user (passed from auth middleware)
  const userId = req.user.id;

  // check if the order exists in the db or not
  const orders = await Order.find({ user: userId });

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the order details successfully",
    orders,
  });
});
