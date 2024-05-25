const Product = require("../models/productModel")
const { ErrorHandler } = require("../utils/errorHandler")
const { AsyncHandler } = require("../utils/asyncHandler")
const { ApiFeatures } = require("../utils/apiFeatures")

// Get all products
exports.getAllProducts = AsyncHandler(async (req, res) => {

    const resultPerPage = 8
    const productsCount = await Product.countDocuments()

    // got the whole object of query and queryStr with the custom functions as well
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    // finding all the products
    const products = await apiFeature.query

    // return the response
    return res.status(200).json({
        success: true,
        message: "Got all the products successfully",
        products,
        productsCount
    })

})

// Create product (Admin)
exports.createProduct = AsyncHandler(async (req, res) => {
    // get the user id from req.user and insert it inside req.body
    req.body.user = req.user.id

    // get data from request body
    const product = await Product.create(req.body)

    // return the response
    return res.status(201).json({
        success: true,
        message: "Created the product successfully",
        product
    })
})

// Update product (Admin)
exports.updateProduct = AsyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    product = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
            new: true,
            runValidators: true
        })

    return res.status(200).json({
        success: true,
        message: "Product is updated successfully",
        product
    })

})

// Delete product (Admin)
exports.deleteProduct = AsyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    await product.deleteOne()
    return res.status(200).json({
        success: true,
        message: "Product is deleted successfully"
    })
})

// Get product details
exports.getProductDetails = AsyncHandler(async (req, res, next) => {
    // get product id from request params
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    return res.status(200).json({
        success: true,
        message: "Got product details successfully",
        product
    })
})

// Create a review or update the review
exports.createProductReview = AsyncHandler(async (req, res, next) => {
    // get data from request body
    const { rating, comment, productId } = req.body

    // validation of data
    if (!rating || !comment || !productId) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    // getting id and name from req.user (passed from auth middleware)
    const { id, name } = req.user

    // create a review object
    const review = {
        user: id,
        name,
        rating: Number(rating),
        comment
    }

    // find the product
    const product = await Product.findById(productId)

    // check if the user already reviewed the product or not
    const isReviewed = product.reviews.find(rev => rev.user.toString() === id.toString())
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === id.toString())
                (rev.rating = rating), (rev.comment = comment);
        })
    } else {
        product.reviews.push(review)
        product.numofReviews = product.reviews.length
    }

    // update the ratings
    let totalRating = 0
    product.reviews.forEach(rev => {
        totalRating += rev.rating
    })
    product.ratings = totalRating / product.reviews.length

    // save the changes
    await product.save({ validateBeforeSave: false })

    // return the response
    return res.status(200).json({
        success: true,
        message: "Created/Updated the review successfully"
    })
})

// Get all reviews of a product
exports.getProductReviews = AsyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }

    return res.status(200).json({
        success: true,
        message: "Got the reviews of the product successfully",
        reviews: product.reviews
    })
})