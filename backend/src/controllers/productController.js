import ProductModel from "../models/productModel.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ProductFeatures } from "../utils/productFeatures.js";
import { createProductReviewSchema } from "../schemas/productSchema.js";

// ====================== Admin Routes ====================== //

// Create a product (Admin)
export const createProduct = AsyncHandler(async (req, res, next) => {
    // insert the user id who is creating the product (Admin) inside the request body
    req.body.user = req.user.id;

    // store all the data for product
    const productData = req.body;

    // create the product
    const product = await ProductModel.create(productData);

    // return the response
    return res.status(201).json({
        success: true,
        messsage: "Created the product successfully",
        product,
    });
});

// Update a product (Admin)
export const updateProduct = AsyncHandler(async (req, res, next) => {
    // get the product id from request params
    const productId = req.params.id;

    // check if the product exists in the db or not
    let product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    // update the product details
    product = await ProductModel.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    // return the response
    return res.status(200).json({
        success: true,
        message: "Updated the product successfully",
        product,
    });
});

// Delete a product (Admin)
export const deleteProduct = AsyncHandler(async (req, res, next) => {
    // get the product id from request params
    const productId = req.params.id;

    // check if the product exists in the db or not
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    // delete the product from db
    await product.deleteOne();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Deleted the product successfully",
    });
});

// Get all products (Admin)
export const getAdminProducts = AsyncHandler(async (req, res, next) => {
    // get all the products
    const products = await ProductModel.find();

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the products successfully",
        products,
    });
});

// ====================== Product Routes ====================== //

// Get all products
export const getAllProducts = AsyncHandler(async (req, res, next) => {
    // get the total no of products
    const totalProductsCount = await ProductModel.countDocuments();

    // set the total no of products to show per page
    const resultsPerPage = 8;

    // get all the data to do all the product operations (pagination,filter,search)
    const productFeatures = new ProductFeatures(ProductModel.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);

    // find the products with the query and query str
    const products = await productFeatures.query;

    // get the no of products filtered
    const filteredProductsCount = products.length;

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the products successfully",
        products,
        filteredProductsCount,
        totalProductsCount,
        resultsPerPage,
    });
});

// Get product details
export const getProductDetails = AsyncHandler(async (req, res, next) => {
    // get the product id from request params
    const productId = req.params.id;

    // check if the product exists in the db or not
    const product = await ProductModel.findById(productId);
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

// Get the product reviews
export const getProductReviews = AsyncHandler(async (req, res, next) => {
    // get the product id from request query
    const productId = req.query.productId;

    // check if the product exists in the db or not
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the reviews successfully",
        reviews: product.reviews,
    });
});

// Create/update product review
export const createProductReview = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { productId, rating, comment } = req.body;

    // get the user info from request user (passed from auth middleware)
    const { id, name } = req.user;

    // validation of data
    await createProductReviewSchema.validateAsync({ rating, comment });

    // check if the product exists in the db or not
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    // create a review
    const review = {
        user: id,
        name,
        rating,
        comment,
    };

    // check if the product is already reviewed by the user or not
    const isProductReviewed = product.reviews.find(
        (rev) => rev.user.toString() === id.toString()
    );
    if (isProductReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === id.toString()) {
                (rev.rating = rating), (rev.comment = comment);
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // get the total no of rating on the product
    let totalRatings = 0;
    product.reviews.forEach((rev) => {
        totalRatings += rev.rating;
    });

    // calculate the average rating on the product
    product.ratings = totalRatings / product.reviews.length;

    // save the changes on db
    await product.save({ validateBeforeSave: false });

    // return the response
    return res.status(200).json({
        success: true,
        message: "Created or updated the review successfully",
    });
});

// Delete product review
export const deleteProductReview = AsyncHandler(async (req, res, next) => {
    // get data from request query
    const reviewId = req.query.id;
    const productId = req.query.productId;

    // check if the product exists in the db or not
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    // filter out the reviews not to delete
    const filteredReviews = product.reviews.filter(
        (rev) => rev._id.toString() !== reviewId.toString()
    );

    // store the total no of reviews using the filtered reviews
    const numOfReviews = filteredReviews.length;

    // store the total ratings using the filtered reviews
    let totalRatings = 0;
    filteredReviews.forEach((rev) => {
        totalRatings += rev.rating;
    });

    // store the product rating using the filtered reviews
    let ratings = 0;
    if (filteredReviews.length === 0) {
        ratings = 0;
    } else {
        ratings = totalRatings / filteredReviews.length;
    }

    // update all the changes
    await ProductModel.findByIdAndUpdate(
        productId,
        {
            reviews: filteredReviews,
            ratings,
            numOfReviews,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    // return the response
    return res.status(200).json({
        success: true,
        message: "Deleted the product review successfully",
    });
});
