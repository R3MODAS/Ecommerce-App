const { Router } = require("express")
const router = Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/productController")
const { auth, authorizeRoles } = require("../middlewares/auth")

router.route("/products").get(getAllProducts)
router.route("/product/:id").get(getProductDetails)

// Admin Routes
router.route("/admin/product/new").post(auth, authorizeRoles("admin"), createProduct)
router.route("/admin/product/:id")
    .put(auth, authorizeRoles("admin"), updateProduct)
    .delete(auth, authorizeRoles("admin"), deleteProduct)

router.route("/review").put(auth, createProductReview)

module.exports = router