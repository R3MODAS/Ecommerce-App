import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";

// ====================== Admin Routes ====================== //

// Create a product (Admin)
export const createProduct = AsyncHandler(async (req, res, next) => {
    // insert the user id (admin) (passed from auth middleware) who created this product in the request body
    req.body.user = req.user.id;

    // store the request body data
    const productData = req.body;

    // create an entry for product in db
    const product = await ProductModel.create(productData);

    // return the response
    return res.status(200).json({
        success: true,
        message: "Created the product successfully",
        product,
    });
});

// Update a product (Admin)
export const updateProduct = AsyncHandler(async (req, res, next) => {
    
});
