const { Router } = require("express");
const router = Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
} = require("../controllers/orderController");
const { auth, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(auth, newOrder);
router.route("/order/:id").get(auth, authorizeRoles("admin"), getSingleOrder);
router.route("/orders/me").get(auth, myOrders);
module.exports = router;
