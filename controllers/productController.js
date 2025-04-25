const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get single product by ID
const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create a product (admin only)
const createProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			countInStock,
			imageUrl,
			category,
		} = req.body;

		const product = await Product.create({
			name,
			description,
			price,
			countInStock,
			imageUrl,
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update a product (admin only)
const updateProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			countInStock,
			imageUrl,
			category,
		} = req.body;

		const product = await Product.findById(req.params.id);

		if (product) {
			product.name = name || product.name;
			product.description =
				description || product.description;
			product.price = price || product.price;
			product.countInStock =
				countInStock || product.countInStock;
			product.imageUrl = imageUrl || product.imageUrl;
			product.category = category || product.category;

			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete a product (admin only)
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.remove();
			res.json({ message: "Product removed" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
