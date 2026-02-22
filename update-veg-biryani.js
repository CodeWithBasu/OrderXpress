const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const brainDir = "C:\\Users\\Basudev\\.gemini\\antigravity\\brain\\406a150c-3b91-4822-a102-a3f8937a6f2b";
const publicDir = "c:\\Users\\Basudev\\Desktop\\OrderXpress\\public";
const files = fs.readdirSync(brainDir);

const m = { prefix: "veg_biryani_", newName: "veg-biryani.png" };
const matches = files.filter(f => f.startsWith(m.prefix) && f.endsWith(".png"));
if (matches.length > 0) {
  const latest = matches.sort().reverse()[0];
  fs.copyFileSync(path.join(brainDir, latest), path.join(publicDir, m.newName));
  console.log(`Copied ${latest} to ${m.newName}`);
}

require('dotenv').config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;
const productSchema = new mongoose.Schema({ name: String, image: String }, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateVegBiryani() {
  try {
    await mongoose.connect(MONGODB_URI)
    await Product.updateOne({ name: "Biryani" }, { $set: { image: "/veg-biryani.png" } });
    console.log("Successfully mapped veg biryani!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}
updateVegBiryani();
