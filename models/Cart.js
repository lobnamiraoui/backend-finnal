// models/cartModel.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
		default: 1,
	},
});

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [cartItemSchema],
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Calculate cart totals
cartSchema.methods.getCartTotal = function () {
	const subtotal = this.items.reduce((total, item) => {
		return total + item.price * item.quantity;
	}, 0);

	const tax = subtotal * 0.1; // 10% tax
	const total = subtotal + tax;

	return {
		subtotal: parseFloat(subtotal.toFixed(2)),
		tax: parseFloat(tax.toFixed(2)),
		total: parseFloat(total.toFixed(2)),
	};
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
