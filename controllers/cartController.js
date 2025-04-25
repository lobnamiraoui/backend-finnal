// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
	const cart = await Cart.findOne({ user: req.user._id });

	if (cart) {
		res.json({
			...cart.toObject(),
			totals: cart.getCartTotal(),
		});
	} else {
		// Create empty cart if none exists
		const newCart = await Cart.create({
			user: req.user._id,
			items: [],
		});

		res.json({
			...newCart.toObject(),
			totals: newCart.getCartTotal(),
		});
	}
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
	const { productId, quantity } = req.body;

	// Validate product exists
	const product = await Product.findById(productId);
	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	// Check if product is in stock
	if (product.countInStock < quantity) {
		res.status(400);
		throw new Error("Not enough items in stock");
	}

	// Find user's cart or create if doesn't exist
	let cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		cart = await Cart.create({
			user: req.user._id,
			items: [],
		});
	}

	// Check if item already exists in cart
	const existingItemIndex = cart.items.findIndex(
		(item) => item.product.toString() === productId
	);

	if (existingItemIndex > -1) {
		// Update existing item
		cart.items[existingItemIndex].quantity += quantity;
	} else {
		// Add new item
		cart.items.push({
			product: productId,
			name: product.name,
			image: product.imageUrl,
			price: product.price,
			quantity,
		});
	}

	// Save updated cart
	await cart.save();

	res.status(201).json({
		...cart.toObject(),
		totals: cart.getCartTotal(),
	});
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
	const { itemId } = req.params;
	const { quantity } = req.body;

	if (quantity < 1) {
		res.status(400);
		throw new Error("Quantity must be at least 1");
	}

	const cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		res.status(404);
		throw new Error("Cart not found");
	}

	const itemIndex = cart.items.findIndex(
		(item) => item._id.toString() === itemId
	);

	if (itemIndex === -1) {
		res.status(404);
		throw new Error("Item not found in cart");
	}

	// Get product to check stock
	const product = await Product.findById(cart.items[itemIndex].product);
	if (product && product.countInStock < quantity) {
		res.status(400);
		throw new Error("Not enough items in stock");
	}

	cart.items[itemIndex].quantity = quantity;
	await cart.save();

	res.json({
		...cart.toObject(),
		totals: cart.getCartTotal(),
	});
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
	const { itemId } = req.params;

	const cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		res.status(404);
		throw new Error("Cart not found");
	}

	// Filter out the item to remove
	cart.items = cart.items.filter(
		(item) => item._id.toString() !== itemId
	);

	await cart.save();

	res.json({
		...cart.toObject(),
		totals: cart.getCartTotal(),
	});
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
	const cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		res.status(404);
		throw new Error("Cart not found");
	}

	cart.items = [];
	await cart.save();

	res.json({
		...cart.toObject(),
		totals: cart.getCartTotal(),
	});
});

module.exports = {
	getUserCart,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};
