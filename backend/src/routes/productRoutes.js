import { Router } from "express";
const router = Router();

import { createProduct } from "../controllers/productController.js";
import { auth, authorizeRoles } from "../middlewares/auth.js";

// Product routes
router.route("/admin/product/new").post(auth, authorizeRoles("admin"), createProduct)

export default router;
