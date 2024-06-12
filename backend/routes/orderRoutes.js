const { Router } = require("express");
const router = Router();

const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder } = require("../controllers/orderController");
const { auth, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(auth, newOrder);
router.route("/order/:id").get(auth, getSingleOrder)
router.route("/orders/me").get(auth, myOrders)

router.route("/admin/orders").get(auth, authorizeRoles("admin"), getAllOrders)
router.route("/admin/order/:id")
    
    .delete(auth, authorizeRoles("admin"), deleteOrder)

module.exports = router;
