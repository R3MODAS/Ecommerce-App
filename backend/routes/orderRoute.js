const { Router } = require("express");
const router = Router();

const { newOrder } = require("../controllers/orderController");
const { auth, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(auth, newOrder);

module.exports = router;
