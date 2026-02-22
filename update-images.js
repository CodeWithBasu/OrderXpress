// seed.js
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://basudevmuna111_db:Itskd8HAjJi4nrU1@orderxpresscluster.wtt1en5.mongodb.net/OrderXpressDB?appName=OrderXpressCluster";

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

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI)
    
    // Update Guava Cooler
    await Product.updateOne(
      { name: "Spiced Guava Cooler" },
      { $set: { image: "/spiced-guava.png" } }
    )
    
    // Update Kombucha
    await Product.updateOne(
      { name: "Mango Turmeric Kombucha" },
      { $set: { image: "/mango-kombucha.png" } }
    )

    console.log("Successfully mapped new generative images!")
  } catch (err) {
    console.error(err)
  } finally {
    mongoose.connection.close()
  }
}

updateImages()
