import { Router } from "express";
const router = Router();

import {
    createProduct,
    createProductReview,
    deleteProduct,
    deleteProductReview,
    getAdminProducts,
    getAllProducts,
    getProductDetails,
    getProductReviews,
    updateProduct,
} from "../controllers/productController.js";
import { auth, authorizeRoles } from "../middlewares/auth.js";

// Admin routes
router
    .route("/admin/product/new")
    .post(auth, authorizeRoles("admin"), createProduct);
router
    .route("/admin/product/:id")
    .put(auth, authorizeRoles("admin"), updateProduct)
    .delete(auth, authorizeRoles("admin"), deleteProduct);
router
    .route("/admin/products")
    .get(auth, authorizeRoles("admin"), getAdminProducts);

// Product routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(auth, createProductReview);
router
    .route("/reviews")
    .get(getProductReviews)
    .delete(auth, deleteProductReview);

export default router;
