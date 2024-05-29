const { Router } = require("express");
const router = Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllProducts,
} = require("../controllers/productController");
const { auth, authorizeRoles } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************

router
  .route("/admin/product/new")
  .post(auth, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(auth, authorizeRoles("admin"), updateProduct)
  .delete(auth, authorizeRoles("admin"), deleteProduct);

// ********************************************************************************************************
//                                      Product routes
// ********************************************************************************************************

router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);

module.exports = router;
