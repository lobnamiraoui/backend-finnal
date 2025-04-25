const express = require("express");
const router = express.Router();
const {
	createOrder,
	getOrderById,
	updateOrderToPaid,
	getUserOrders,
	getOrders,
	updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth");
router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
