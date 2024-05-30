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
    useFindAndModify: false,
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

// Get all Products
exports.getAllProducts = AsyncHandler(async (req, res, next) => {
  // get the total no of products
  const productsCount = await Product.countDocuments();

  // total no of products shown in a single page
  const resultPerPage = 8;

  // Get the search and filter feature for finding products
  const features = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  // find the products with the search and filter query
  let products = await features.query;

  // get the total no of filtered products
  const filteredProductsCount = products.length;

  return res.status(200).json({
    success: true,
    message: "Got all the products successfully",
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
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

// Create or update review
exports.createProductReview = AsyncHandler(async (req, res, next) => {
  // get data from request body
  const { rating, comment, productId } = req.body;

  // get the user data who reviewed the product
  const { id, name } = req.user;

  // validation of data
  if (!rating || !comment || !productId) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // create a new review to entry it in db
  const review = {
    user: id,
    name: name,
    rating: Number(rating),
    comment,
  };

  // check if the product to be reviewed exists in the db or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // check if the product is already reviewed by the user or not
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === id.toString()
  );
  // if the product is already reviewed then update the review for the current user
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  }
  // if the product is not reviewed then push the new review and update the total no of reviews
  else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // update the rating
  let totalRatings = 0;
  product.reviews.forEach((rev) => {
    totalRatings += rev.rating;
  });
  product.ratings = totalRatings / product.reviews.length;

  // save all the updates
  await product.save({ validateBeforeSave: false });

  // return the response
  return res.status(200).json({
    success: true,
    message: "created or updated the review successfully",
  });
});

// Get all reviews of a product
exports.getProductReviews = AsyncHandler(async (req, res, next) => {
  // get the product id from request query
  const productId = req.query.productId;

  // check if the product exists in the db or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: "Got all the reviews for the product successfully",
    reviews: product.reviews,
  });
});

// Delete review
exports.deleteProductReview = AsyncHandler(async (req, res, next) => {
  // get the product id and review id from request query
  const productId = req.query.productId;
  const reviewId = req.query.id;

  // check if the product exists in the db or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product is not found", 400));
  }

  // filter out the reviews not to delete
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  console.log(reviews)

  // store the ratings using the filtered reviews
  let totalRatings = 0;
  reviews.forEach((rev) => {
    totalRatings += rev.rating;
  });
  const ratings = totalRatings / reviews.length;

  // store the no of reviews using the filtered reviews
  const numOfReviews = reviews.length;

  // update the data for the product
  await Product.findByIdAndUpdate(
    productId,
    {
      numOfReviews,
      reviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // return the response
  return res.status(200).json({
    success: true,
    message: "Deleted the product review successfully",
  });
});
