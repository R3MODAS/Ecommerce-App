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
    return next(new ErrorHandler("Order is not found", 400));
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

// Get all orders (Admin)
exports.getAllOrders = AsyncHandler(async (req, res, next) => {
  // get all the orders
  const orders = await Order.find();

  // get the total amount
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got all the orders successfully",
    orders,
    totalAmount,
  });
});

// Update order (Admin)
exports.updateOrder = AsyncHandler(async (req, res, next) => {
  // get the order id
  const orderId = req.params.id;

  // get the order status from request body
  const { status } = req.body;

  // validation of data
  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  // check if the order exists in the db or not
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHandler("Order is not found", 400));
  }

  // check if the order is already delivered or not
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // if the order status is set to shipped then update the product stock
  if (status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      // update the stock of the product
      await updateStock(o.product, o.quantity);
    });
  }

  // update the order status in db
  order.orderStatus = status;

  // set the delivered time once the order is delivered
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // save the changes
  await order.save({ validateBeforeSave: false });

  // return the response
  return res.status(200).json({
    success: true,
    message: "Updated the order status successfully",
  });
});

async function updateStock(id, quantity) {
  // find the product the user ordered
  const product = await Product.findById(id);

  console.log(product.stock);
  // decrease the stock quantity
  product.stock -= quantity;
  // save the changes
  await product.save({ validateBeforeSave: false });
}

// Delete order (Admin)
exports.deleteOrder = AsyncHandler(async (req, res, next) => {
  // get the order id using request params
  const orderId = req.params.id;

  // check if the order exists in the db or not
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHandler("Order is not found", 400));
  }

  // remove the order
  await order.deleteOne();

  // return the response
  return res.status(200).json({
    success: true,
    message: "Deleted the order successfully",
  });
});
