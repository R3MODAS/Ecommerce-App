const Product = require("../models/productModel")
const { ErrorHandler } = require("../utils/errorHandler")
const { AsyncHandler } = require("../utils/asyncHandler")

// Create product (Admin)
exports.createProduct = AsyncHandler(async (req, res) => {
    const product = await Product.create(req.body)
    return res.status(201).json({
        success: true,
        message: "Created the product successfully",
        product
    })
})

// Get all products
exports.getAllProducts = AsyncHandler(async (req, res) => {

    const products = await Product.find()

    return res.status(200).json({
        message: "Got all the products successfully",
        products
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