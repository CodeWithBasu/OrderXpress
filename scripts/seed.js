// seed.js
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;

// Basic Schema definition avoiding typescript for pure node execution
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  cost: Number,
  category: String,
  description: String,
  stock: Number,
  lowStockThreshold: Number,
  supplier: String,
  image: String,
  lastRestocked: Date,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const newItems = [
  // 1. Beverages & Drinks (Non-Alcoholic)
  { id: 101, name: "Spiced Guava Cooler", price: 299, cost: 80, category: "beverages", description: "With black salt", stock: 100, lowStockThreshold: 20, image: "/refreshing-cola.png" },
  { id: 102, name: "Cucumber Basil Smash", price: 249, cost: 70, category: "beverages", description: "Elevated mocktail", stock: 100, lowStockThreshold: 20, image: "/refreshing-cola.png" },
  { id: 103, name: "Lavender Lemonade Spritz", price: 279, cost: 75, category: "beverages", description: "Light and floral", stock: 100, lowStockThreshold: 20, image: "/refreshing-cola.png" },
  { id: 104, name: "Virgin Mojito", price: 199, cost: 50, category: "beverages", description: "Classic mocktail", stock: 100, lowStockThreshold: 20, image: "/refreshing-cola.png" },
  { id: 105, name: "Mango Lassi", price: 179, cost: 60, category: "beverages", description: "Cardamom infused", stock: 100, lowStockThreshold: 20, image: "/glass-of-orange-juice.png" },
  { id: 106, name: "Masala Chai Iced Latte", price: 199, cost: 55, category: "beverages", description: "Traditional fusion", stock: 100, lowStockThreshold: 20, image: "/latte-coffee.png" },
  { id: 107, name: "Shikanji", price: 149, cost: 40, category: "beverages", description: "Indian spiced lemonade", stock: 100, lowStockThreshold: 20, image: "/refreshing-cola.png" },
  { id: 108, name: "Mango Turmeric Kombucha", price: 249, cost: 90, category: "beverages", description: "Fermented tea", stock: 50, lowStockThreshold: 10, image: "/iced-tea.png" },

  // 2. Food (Main Courses)
  { id: 201, name: "Pink Sauce Pasta", price: 399, cost: 150, category: "main courses", description: "Italian classic", stock: 50, lowStockThreshold: 10, image: "/classic-beef-burger.png" },
  { id: 202, name: "Veggie Pizza", price: 449, cost: 180, category: "main courses", description: "Wood-fired", stock: 50, lowStockThreshold: 10, image: "/delicious-pizza.png" },
  { id: 203, name: "Lasagna", price: 499, cost: 200, category: "main courses", description: "Layered perfection", stock: 40, lowStockThreshold: 10, image: "/classic-beef-burger.png" },
  { id: 204, name: "Butter Chicken", price: 399, cost: 160, category: "main courses", description: "North Indian delight", stock: 60, lowStockThreshold: 15, image: "/classic-beef-burger.png" },
  { id: 205, name: "Dal Makhani", price: 299, cost: 120, category: "main courses", description: "Slow-cooked black lentils", stock: 80, lowStockThreshold: 20, image: "/classic-beef-burger.png" },
  { id: 206, name: "Paneer Tikka Masala", price: 349, cost: 140, category: "main courses", description: "Rich and creamy", stock: 60, lowStockThreshold: 15, image: "/classic-beef-burger.png" },
  { id: 207, name: "Chicken Biryani", price: 399, cost: 180, category: "main courses", description: "Aromatic basmati rice", stock: 60, lowStockThreshold: 15, image: "/classic-beef-burger.png" },
  { id: 208, name: "Chicken Momo", price: 249, cost: 100, category: "main courses", description: "Himalayan dumplings", stock: 100, lowStockThreshold: 20, image: "/classic-beef-burger.png" },

  // 3. Snacks & Appetizers
  { id: 301, name: "Peri Peri Chicken Wings", price: 299, cost: 120, category: "snacks", description: "Spicy and crunchy", stock: 80, lowStockThreshold: 15, image: "/crispy-chicken-wings.png" },
  { id: 302, name: "French Fries", price: 149, cost: 50, category: "snacks", description: "Classic salted", stock: 150, lowStockThreshold: 30, image: "/crispy-french-fries.png" },
  { id: 303, name: "Crispy Baby Corn", price: 229, cost: 80, category: "snacks", description: "Sweet and spicy", stock: 80, lowStockThreshold: 15, image: "/crispy-french-fries.png" },
  { id: 304, name: "Chinese Bhel", price: 199, cost: 70, category: "snacks", description: "Crispy noodles with veggies", stock: 80, lowStockThreshold: 15, image: "/crispy-french-fries.png" },
  { id: 305, name: "Chicken Pakora", price: 249, cost: 100, category: "snacks", description: "Indian spiced fritters", stock: 80, lowStockThreshold: 15, image: "/crispy-chicken-wings.png" },
  { id: 306, name: "Cheese Balls", price: 199, cost: 80, category: "snacks", description: "Melted gooey center", stock: 100, lowStockThreshold: 20, image: "/crispy-french-fries.png" },

  // 4. Desserts
  { id: 401, name: "Saffron Rasmalai", price: 199, cost: 80, category: "desserts", description: "Chilled traditional sweet", stock: 60, lowStockThreshold: 10, image: "/ice-cream-sundae.png" },
  { id: 402, name: "Mango Soufflé", price: 229, cost: 90, category: "desserts", description: "Light and airy", stock: 40, lowStockThreshold: 10, image: "/ice-cream-sundae.png" },
  { id: 403, name: "Gulab Jamun", price: 149, cost: 60, category: "desserts", description: "Warm Indian sweet", stock: 100, lowStockThreshold: 20, image: "/chocolate-cake-slice.png" },
  { id: 404, name: "Gajar ka Halwa", price: 179, cost: 70, category: "desserts", description: "Warm carrot pudding", stock: 80, lowStockThreshold: 15, image: "/chocolate-cake-slice.png" },
  { id: 405, name: "New York Cheesecake", price: 299, cost: 120, category: "desserts", description: "Classic pastry", stock: 50, lowStockThreshold: 10, image: "/cheesecake-slice.png" },
  { id: 406, name: "Tiramisu", price: 349, cost: 140, category: "desserts", description: "Coffee flavored Italian dessert", stock: 40, lowStockThreshold: 10, image: "/chocolate-cake-slice.png" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");
    
    // Check what is already there to prevent duplications if ran twice
    const existing = await Product.find({});
    console.log(`Currently there are ${existing.length} items in the DB.`);
    
    await Product.insertMany(newItems);
    console.log("Successfully seeded 28 artisanal food and drink items!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
