const User = require("../models/userModel");
const Product = require("../models/productModel");
const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const mailer = require("../utils/mailer");

// ====================== Admin Routes ====================== //

// Create a product (Admin)
exports.createProduct = AsyncHandler(async (req, res, next) => {});
