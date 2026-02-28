import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  stock: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, required: true, default: 5 },
  supplier: { type: String, default: "" },
  image: { type: String, default: "" },
  lastRestocked: { type: Date, default: Date.now },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  // Beverages
  { id: 101, name: "Spiced Guava Cooler", price: 299, cost: 80, category: "beverages", description: "Refreshingly spicy guava drink with black salt.", stock: 100, lowStockThreshold: 20, image: "/spiced-guava.png" },
  { id: 102, name: "Virgin Mojito", price: 199, cost: 50, category: "beverages", description: "Classic mint and lime mocktail.", stock: 100, lowStockThreshold: 20, image: "/virgin-mojito.png" },
  { id: 103, name: "Mango Lassi", price: 179, cost: 60, category: "beverages", description: "Creamy yogurt-based mango drink.", stock: 100, lowStockThreshold: 20, image: "/mango-lassi.png" },
  { id: 104, name: "Masala Chai", price: 99, cost: 30, category: "beverages", description: "Traditional Indian spiced tea.", stock: 200, lowStockThreshold: 50, image: "/masala-chai.png" },
  { id: 105, name: "Latte Coffee", price: 189, cost: 60, category: "beverages", description: "Rich and creamy steamed milk coffee.", stock: 100, lowStockThreshold: 20, image: "/latte-coffee.png" },
  { id: 106, name: "Iced Tea", price: 149, cost: 40, category: "beverages", description: "Chilled tea with a hint of lemon.", stock: 150, lowStockThreshold: 30, image: "/iced-tea.png" },
  { id: 107, name: "Lavender Lemonade", price: 229, cost: 70, category: "beverages", description: "Floral and refreshing citrus drink.", stock: 80, lowStockThreshold: 15, image: "/lavender-lemonade.png" },
  { id: 108, name: "Mango Turmeric Kombucha", price: 279, cost: 90, category: "beverages", description: "Probiotic fermented tea with mango.", stock: 50, lowStockThreshold: 10, image: "/mango-kombucha.png" },
  { id: 109, name: "Shikanji", price: 129, cost: 35, category: "beverages", description: "Traditional Indian lemonade with spices.", stock: 150, lowStockThreshold: 30, image: "/shikanji.png" },
  { id: 110, name: "Orange Juice", price: 159, cost: 50, category: "beverages", description: "Freshly squeezed 100% natural orange juice.", stock: 100, lowStockThreshold: 20, image: "/glass-of-orange-juice.png" },
  { id: 111, name: "Refreshing Cola", price: 99, cost: 30, category: "beverages", description: "Classic chilled cola drink.", stock: 200, lowStockThreshold: 50, image: "/refreshing-cola.png" },
  { id: 112, name: "Bottled Water", price: 49, cost: 15, category: "beverages", description: "Pure mineral water.", stock: 300, lowStockThreshold: 50, image: "/bottled-water.png" },

  // Main Courses
  { id: 201, name: "Butter Chicken", price: 449, cost: 180, category: "main courses", description: "Creamy tomato-based chicken curry.", stock: 60, lowStockThreshold: 15, image: "/butter-chicken.png" },
  { id: 202, name: "Chicken Biryani", price: 499, cost: 200, category: "main courses", description: "Fragrant basmati rice with spiced chicken.", stock: 50, lowStockThreshold: 15, image: "/chicken-biryani.png" },
  { id: 203, name: "Veg Biryani", price: 399, cost: 150, category: "main courses", description: "Aromatic rice with garden fresh vegetables.", stock: 60, lowStockThreshold: 15, image: "/veg-biryani.png" },
  { id: 204, name: "Paneer Tikka Masala", price: 429, cost: 170, category: "main courses", description: "Grilled paneer cubes in a rich gravy.", stock: 60, lowStockThreshold: 15, image: "/paneer-tikka.png" },
  { id: 205, name: "Dal Makhani", price: 349, cost: 130, category: "main courses", description: "Slow-cooked black lentils with butter and cream.", stock: 80, lowStockThreshold: 20, image: "/dal-makhani.png" },
  { id: 206, name: "Chicken Momo", price: 299, cost: 110, category: "main courses", description: "Steamed Himalayan chicken dumplings.", stock: 100, lowStockThreshold: 20, image: "/chicken-momo.png" },
  { id: 207, name: "Pink Sauce Pasta", price: 379, cost: 140, category: "main courses", description: "Pasta in a blend of red and white sauce.", stock: 50, lowStockThreshold: 10, image: "/pink-pasta.png" },
  { id: 208, name: "Delicious Pizza", price: 549, cost: 220, category: "main courses", description: "Customizable pizza with fresh toppings.", stock: 40, lowStockThreshold: 10, image: "/delicious-pizza.png" },
  { id: 209, name: "Veggie Pizza", price: 499, cost: 190, category: "main courses", description: "Loaded with fresh vegetables and cheese.", stock: 45, lowStockThreshold: 10, image: "/veggie-pizza-new.png" },
  { id: 210, name: "Lasagna", price: 599, cost: 250, category: "main courses", description: "Classic Italian layered pasta dish.", stock: 35, lowStockThreshold: 10, image: "/lasagna.png" },
  { id: 211, name: "Classic Beef Burger", price: 349, cost: 140, category: "main courses", description: "Juicy beef patty with fresh lettuce and cheese.", stock: 70, lowStockThreshold: 15, image: "/classic-beef-burger.png" },

  // Snacks & Appetizers
  { id: 301, name: "Cheese Balls", price: 249, cost: 90, category: "snacks", description: "Deep-fried cheese stuffed snacks.", stock: 120, lowStockThreshold: 25, image: "/cheese-balls.png" },
  { id: 302, name: "Chicken Pakora", price: 299, cost: 120, category: "snacks", description: "Spiced chicken fritters.", stock: 100, lowStockThreshold: 20, image: "/chicken-pakora.png" },
  { id: 303, name: "Chinese Bhel", price: 189, cost: 70, category: "snacks", description: "Indo-Chinese fusion snack.", stock: 150, lowStockThreshold: 30, image: "/chinese-bhel.png" },
  { id: 304, name: "Crispy Baby Corn", price: 269, cost: 100, category: "snacks", description: "Crunchy baby corn with spicy coating.", stock: 90, lowStockThreshold: 20, image: "/crispy-baby-corn.png" },
  { id: 305, name: "Crispy Chicken Wings", price: 349, cost: 150, category: "snacks", description: "Deep-fried wings with choice of sauce.", stock: 80, lowStockThreshold: 15, image: "/crispy-chicken-wings.png" },
  { id: 306, name: "Peri Peri Wings", price: 379, cost: 160, category: "snacks", description: "Spicy peri peri marinated chicken wings.", stock: 80, lowStockThreshold: 15, image: "/peri-peri-wings.png" },
  { id: 307, name: "Crispy French Fries", price: 149, cost: 50, category: "snacks", description: "Golden fried salted potato strips.", stock: 200, lowStockThreshold: 40, image: "/crispy-french-fries.png" },
  { id: 308, name: "Vibrant Mixed Salad", price: 199, cost: 70, category: "snacks", description: "Healthy mix of seasonal fresh greens.", stock: 60, lowStockThreshold: 15, image: "/vibrant-mixed-salad.png" },

  // Desserts
  { id: 401, name: "Apple Pie", price: 249, cost: 90, category: "desserts", description: "Warm classic apple pie slice.", stock: 40, lowStockThreshold: 10, image: "/apple-pie-slice.png" },
  { id: 402, name: "Chocolate Cake", price: 229, cost: 80, category: "desserts", description: "Rich and moist chocolate cake slice.", stock: 50, lowStockThreshold: 15, image: "/chocolate-cake-slice.png" },
  { id: 403, name: "Chocolate Brownie", price: 199, cost: 70, category: "desserts", description: "Fudgy chocolate brownie.", stock: 60, lowStockThreshold: 15, image: "/chocolate-brownie.png" },
  { id: 404, name: "Cheesecake Slice", price: 299, cost: 110, category: "desserts", description: "Smooth and creamy cheesecake slice.", stock: 40, lowStockThreshold: 10, image: "/cheesecake-slice.png" },
  { id: 405, name: "NY Cheesecake", price: 349, cost: 130, category: "desserts", description: "Deluxe New York style cheesecake.", stock: 35, lowStockThreshold: 10, image: "/ny-cheesecake.png" },
  { id: 406, name: "Gulab Jamun", price: 149, cost: 50, category: "desserts", description: "Warm Indian milk-solid based sweet.", stock: 100, lowStockThreshold: 20, image: "/gulab-jamun.png" },
  { id: 407, name: "Gajar ka Halwa", price: 179, cost: 60, category: "desserts", description: "Traditional Indian carrot pudding.", stock: 80, lowStockThreshold: 15, image: "/gajar-halwa.png" },
  { id: 408, name: "Saffron Rasmalai", price: 219, cost: 85, category: "desserts", description: "Chilled milk-based sweet with saffron.", stock: 60, lowStockThreshold: 10, image: "/rasmalai.png" },
  { id: 409, name: "Mango Souffle", price: 249, cost: 90, category: "desserts", description: "Light and airy mango dessert.", stock: 40, lowStockThreshold: 10, image: "/mango-souffle.png" },
  { id: 410, name: "Tiramisu", price: 399, cost: 150, category: "desserts", description: "Classic Italian coffee-flavored dessert.", stock: 30, lowStockThreshold: 8, image: "/tiramisu.png" },
  { id: 411, name: "Ice Cream Sundae", price: 229, cost: 80, category: "desserts", description: "Choice of ice cream with toppings.", stock: 100, lowStockThreshold: 20, image: "/ice-cream-sundae.png" },
];

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding!");

    // Clear existing products first to avoid duplicates with same ID
    await Product.deleteMany({ category: { $in: ["beverages", "main courses", "snacks", "desserts"] } });
    console.log("Cleared existing specific product categories.");

    const result = await Product.insertMany(products);
    console.log(`Successfully added ${result.length} products with actual images!`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedDatabase();
