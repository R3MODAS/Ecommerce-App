const { Router } = require("express");
const router = Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllProducts,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controllers/productController");
const { auth, authorizeRoles } = require("../middlewares/auth");

router
  .route("/admin/product/new")
  .post(auth, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(auth, authorizeRoles("admin"), updateProduct)
  .delete(auth, authorizeRoles("admin"), deleteProduct);

router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(auth, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(auth, deleteProductReview);

module.exports = router;
