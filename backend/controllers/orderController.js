const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");

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

  // get the user id from req user (passed from auth middleware)
  const userId = req.user.id;

  // create the order entry in db
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
  // get the order id from request params
  const orderId = req.params.id;

  // check if the order exists in the db or not
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .exec();
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

// Get all the orders made by the logged in user
exports.myOrders = AsyncHandler(async (req, res, next) => {
  // get the user id from req user (passed from auth middleware)
  const userId = req.user.id;

  // find the orders for the user
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .exec();

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got all the orders successfully",
    orders,
  });
});

// Get all orders (Admin)
exports.getAllOrders = AsyncHandler(async (req, res, nex) => {
  // find all the orders made by the users
  const orders = await Order.find().populate("user", "name email").exec()

  // get the total amount
  let totalAmount = 0
  orders.forEach(order => {
    totalAmount += order.totalPrice
  })

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got all the orders successfully",
    orders,
    totalAmount
  })

})

// Update order (Admin)
exports.updateOrder = AsyncHandler(async (req, res, next) => {
  // get data (order status) from request body
  const { status } = req.body

  // get the orderId from request params
  const orderId = req.params.id

  // check if the order exists in the db or not
  const order = await Order.findById(orderId)
  if (!order) {
    return next(new ErrorHandler("Order is not found", 400))
  }

  // check if the order is already delivered or not
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order has been already delivered", 400))
  }

  // check the order quantity and update the product stock once the product is delivered
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity)
  })

  // update the order status
  order.orderStatus = status

  // update the delivery time if the order status is delivered
  if (status === "Delivered") {
    order.deliveredAt = Date.now()
  }

  // save all the changes
  await order.save({ validateBeforeSave: false })

  // return the response
  return res.status(200).json({
    success: true,
    message: "Updated the order status successfully"
  })

})

// updating the product stock once the product is delivered
async function updateStock(productId, quantity) {
  // find the product you want to update the stock
  const product = await Product.findById(productId)

  // update the stock once the product is delivered
  product.stock -= quantity

  // save the changes
  await product.save({ validateBeforeSave: false })
}

// Delete order (Admin)
exports.deleteOrder = AsyncHandler(async (req, res, next) => {
  // get the order id from request params
  const orderId = req.params.id

  // check if the product exists in the db or not
  const order = await Order.findById(orderId)
  if (!order) {
    return next(new ErrorHandler("Order is not found", 400))
  }

  // delete the order
  await order.deleteOne()

  // return the response
  return res.status(200).json({
    success: true,
    message: "Deleted the order successfully"
  })
})