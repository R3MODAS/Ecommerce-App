const { Router } = require("express")
const router = Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController")
const { auth, authorizeRoles } = require("../middlewares/auth")

router.route("/products").get(getAllProducts)
router.route("/product/new").post(auth, authorizeRoles("admin"), createProduct)
router.route("/product/:id")
    .put(auth, authorizeRoles("admin"), updateProduct)
    .delete(auth, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails)

module.exports = router