const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://basudevmuna111_db:Itskd8HAjJi4nrU1@orderxpresscluster.wtt1en5.mongodb.net/OrderXpressDB?appName=OrderXpressCluster";

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
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function testUpdate() {
  try {
    await mongoose.connect(MONGODB_URI)
    
    // Test same parameters as PUT /api/products/101
    const body = {name: "Edited Biryani", category: "food", price: 250, stock: 10, lowStockThreshold: 5}
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number("101") }, 
      body, 
      { new: true }
    )
    console.log("Success:", updatedProduct);
  } catch (err) {
    console.error("Error updating:", err);
  } finally {
    mongoose.connection.close()
  }
}

testUpdate();
