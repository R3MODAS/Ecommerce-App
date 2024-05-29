const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter the product description"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please enter the product price"],
        maxLength: [8, "Price cannot exceed more than 8 figures"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter the product category"],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, "Please enter the product stock"],
        maxLength: [4, "Stock cannot exceed more than 4"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product