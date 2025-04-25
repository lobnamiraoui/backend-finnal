// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
	getUserCart,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");

// All cart routes are protected - require authentication
router.use(protect);

router.route("/")
	.get(getUserCart) // Get the user's cart
	.post(addToCart) // Add item to cart
	.delete(clearCart); // Clear entire cart

router.route("/:itemId")
	.put(updateCartItem) // Update quantity of an item
	.delete(removeCartItem); // Remove an item from cart

module.exports = router;
