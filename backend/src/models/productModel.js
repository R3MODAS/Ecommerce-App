import mongoose, { Schema } from "mongoose";

// Product schema
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Please enter a product description"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Please enter the product price"],
            trim: true,
            maxLength: [8, "Price must not exceed 8 figures"],
        },
        category: {
            type: String,
            required: [true, "Please enter the product category"],
            trim: true,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        stock: {
            type: Number,
            required: [true, "Please enter the product stock"],
            default: 1,
        },
        user: {
            type: Schema.Types.ObjectId, // The user who added this product (from admin panel)
            ref: "User",
            required: true,
            index: true,
        },
        ratings: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
