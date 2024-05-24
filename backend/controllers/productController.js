const Product = require("../models/productModel")
const { ErrorHandler } = require("../utils/errorHandler")
const { AsyncHandler } = require("../utils/asyncHandler")
const { ApiFeatures } = require("../utils/apiFeatures")

// Create product (Admin)
exports.createProduct = AsyncHandler(async (req, res) => {
    // get data from request body
    const product = await Product.create(req.body)

    // return the response
    return res.status(201).json({
        success: true,
        message: "Created the product successfully",
        product
    })
})

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