// seeder.js - Script to populate database with sample data

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Orders");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Sample data
const users = [
	{
		name: "Admin User",
		email: "admin@example.com",
		password: "password123",
		isAdmin: true,
	},
	{
		name: "John Doe",
		email: "john@example.com",
		password: "password123",
		isAdmin: false,
	},
	{
		name: "Jane Smith",
		email: "jane@example.com",
		password: "password123",
		isAdmin: false,
	},
];

const products = [
	
	
	{
	  name: "Montre dorée classique",
	  description: "Montre pour femme avec un bracelet doré et un design intemporel.",
	  price: 199.99,
	  countInStock: 10,
	  imageUrl: "/assets/montre1.jpg",
	  category: "Montres",
	},
	{
	  name: "robe",
	  description: "robe tendance pour un look professionnel ou décontracté.",
	  price: 99.99,
	  countInStock: 12,
	  imageUrl: "/assets/robe.jpg",
	  category: "Vêtements",
	},
	{
	  name: "Mini sac à bandoulière",
	  description: "Petit sac stylé avec chaîne dorée pour une touche chic.",
	  price: 69.99,
	  countInStock: 25,
	  imageUrl: "/assets/sac3.jpg",
	  category: "Sacs",
	},
	{
	  name: "Montre ",
	  description: "Montre tendance avec un boîtier en acier inoxydable rouge.",
	  price: 149.99,
	  countInStock: 8,
	  imageUrl: "/assets/montre3.jpg",
	  category: "Montres",
	},
	{
	  name: "robe bleau",
	  description: "robe fluide plissée pour un look féminin et moderne.",
	  price: 59.99,
	  countInStock: 18,
	  imageUrl: "/assets/robe2.webp",
	  category: "Vêtements",
	},
	{
	  name: "Sac ",
	  description: "Grand sac cabas en toile, pratique et stylé pour le quotidien.",
	  price: 49.99,
	  countInStock: 30,
	  imageUrl: "/assets/sec1.jpg",
	  category: "Sacs",
	},

	{
		name: "Sac ",
		description: "Grand sac cabas en toile, pratique et stylé pour le quotidien.",
		price: 50.99,
		countInStock: 30,
		imageUrl: "/assets/sec2.jpg",
		category: "Sacs",
	  },
	  {
		name: "Sac ",
		description: "Grand sac cabas en toile, pratique et stylé pour le quotidien.",
		price: 60.99,
		countInStock: 30,
		imageUrl: "/assets/sacs.jpg",
		category: "Sacs",
	  },
	  {
		name: "Montre dorée classique",
		description: "Montre pour femme avec un bracelet doré et un design intemporel.",
		price: 199.99,
		countInStock: 10,
		imageUrl: "/assets/montre4.jpg",
		category: "Montres",
	  },
  ];

// Import data into DB
const importData = async () => {
	try {
		// Clear existing data
		await User.deleteMany();
		await Product.deleteMany();
		await Order.deleteMany();

		console.log("Data cleared...");

		// Create users with hashed passwords
		const createdUsers = await User.insertMany(
			users.map((user) => ({
				name: user.name,
				email: user.email,
				password: bcrypt.hashSync(user.password, 10),
				isAdmin: user.isAdmin,
			}))
		);

		const adminUser = createdUsers[0]._id;

		// Add products
		const sampleProducts = products.map((product) => {
			return { ...product };
		});

		await Product.insertMany(sampleProducts);

		// Create sample orders
		const sampleOrder = {
			user: createdUsers[1]._id, // John Doe's ID
			orderItems: [
				{
					name: products[0].name,
					quantity: 1,
					price: products[0].price,
					product: (
						await Product.findOne({
							name: products[0].name,
						})
					)._id,
				},
				{
					name: products[3].name,
					quantity: 2,
					price: products[3].price,
					product: (
						await Product.findOne({
							name: products[3].name,
						})
					)._id,
				},
			],
			shippingAddress: {
				address: "123 Example St",
				city: "Test City",
				postalCode: "12345",
				country: "USA",
			},
			paymentMethod: "e-dinnar",
			totalPrice: products[0].price + products[3].price * 2,
			isPaid: false,
			isDelivered: false,
		};

		await Order.create(sampleOrder);

		console.log("Data imported successfully!");
		process.exit();
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

// Delete all data from DB
const destroyData = async () => {
	try {
		await User.deleteMany();
		await Product.deleteMany();
		await Order.deleteMany();

		console.log("Data destroyed successfully!");
		process.exit();
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

// Execute based on command argument
if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}