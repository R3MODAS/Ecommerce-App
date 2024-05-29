const Product = require("../models/productModel");
const { ApiFeatures } = require("../utils/apiFeatures");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

// Create Product (Admin)
exports.createProduct = AsyncHandler(async (req, res, next) => {
  // insert the user id (passed from auth middleware) inside request body (user)
  req.body.user = req.user.id;

  // create an entry for product
  const product = await Product.create(req.body);

  // return the response
  return res.status(201).json({
    success: true,
    message: "Created the product successfully",
    product,
  });
});

// Update Product (Admin)
exports.updateProduct = AsyncHandler(async (req, res, next) => {
  // get the product id from request params
  const productId = req.params.id;

  // check if the product exists in the db or not
  let product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // update the data
  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  // return the response
  return res.status(200).json({
    success: true,
    message: "Product is updated successfully",
    product,
  });
});

// Delete Product (Admin)
exports.deleteProduct = AsyncHandler(async (req, res, next) => {
  // get the product id from request params
  const productId = req.params.id;

  // check if the product exists in the db or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // delete the product
  await product.deleteOne();

  // return the response
  return res.status(200).json({
    success: true,
    message: "Product is updated successfully",
  });
});

// Get Product Details
exports.getProductDetails = AsyncHandler(async (req, res, next) => {
  // get product id from request params
  const productId = req.params.id;

  // check if the product exists in the db or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the product details successfully",
    product,
  });
});

// Get all Products
exports.getAllProducts = AsyncHandler(async (req, res, next) => {
  // count the total products
  const productsCount = await Product.countDocuments();

  // set the result of product per page
  const resultPerPage = 8;

  // search and filter functionality for getting the products
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  // find the products with the query
  let products = await apiFeature.query;

  // find the filtered products count
  let filteredProductsCount = products.length;

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got the products successfully",
    products,
    filteredProductsCount,
    productsCount
  });
});
