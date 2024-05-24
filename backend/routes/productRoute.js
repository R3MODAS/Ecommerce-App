const { Router } = require("express")
const router = Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController")

router.route("/products").get(getAllProducts)
router.route("/product/new").post(createProduct)
router.route("/product/:id").put(updateProduct)
    .delete(deleteProduct)
    .get(getProductDetails)

module.exports = router