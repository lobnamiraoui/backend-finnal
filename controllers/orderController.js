const Order = require("../models/Orders");

// Create new order
const createOrder = async (req, res) => {
	try {
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			totalPrice,
		} = req.body;

		if (orderItems && orderItems.length === 0) {
			res.status(400).json({ message: "No order items" });
			return;
		}

		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get order by ID
const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate(
			"user",
			"name email"
		);

		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			};

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get logged in user orders
const getUserOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id });
		res.json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update order to delivered (admin only)
const updateOrderToDelivered = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isDelivered = true;
			order.deliveredAt = Date.now();

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get all orders (admin only)
const getOrders = async (req, res) => {
	try {
		const orders = await Order.find({}).populate("user", "id name");
		res.json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	createOrder,
	getOrderById,
	updateOrderToPaid,
	getUserOrders,
	getOrders,
	updateOrderToDelivered,
};
