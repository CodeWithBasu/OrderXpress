const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://basudevmuna111_db:Itskd8HAjJi4nrU1@orderxpresscluster.wtt1en5.mongodb.net/OrderXpressDB?appName=OrderXpressCluster";

const productSchema = new mongoose.Schema({ name: String, image: String }, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateAllImages() {
  try {
    await mongoose.connect(MONGODB_URI)
    
    const updates = [
      { name: "Pink Sauce Pasta", image: "/pink-pasta.png" },
      { name: "Butter Chicken", image: "/butter-chicken.png" },
      { name: "Chicken Biryani", image: "/chicken-biryani.png" },
      { name: "Paneer Tikka Masala", image: "/paneer-tikka.png" },
      { name: "Chicken Momo", image: "/chicken-momo.png" },
      { name: "Saffron Rasmalai", image: "/rasmalai.png" },
      { name: "Tiramisu", image: "/tiramisu.png" },
      { name: "Dal Makhani", image: "/dal-makhani.png" },
      { name: "Veggie Pizza", image: "/veggie-pizza-new.png" },
      { name: "Chinese Bhel", image: "/chinese-bhel.png" },
      { name: "Chicken Pakora", image: "/chicken-pakora.png" },
      { name: "Lasagna", image: "/lasagna.png" },
      { name: "Cheese Balls", image: "/cheese-balls.png" },
      { name: "New York Cheesecake", image: "/ny-cheesecake.png" },
      { name: "Peri Peri Chicken Wings", image: "/peri-peri-wings.png" },
      { name: "French Fries", image: "/french-fries.png" },
      { name: "Masala Chai Iced Latte", image: "/masala-chai.png" },
      { name: "Shikanji", image: "/shikanji.png" },
      { name: "Virgin Mojito", image: "/virgin-mojito.png" },
      { name: "Mango Lassi", image: "/mango-lassi.png" },
      { name: "Gulab Jamun", image: "/gulab-jamun.png" },
      { name: "Gajar ka Halwa", image: "/gajar-halwa.png" },
      { name: "Crispy Baby Corn", image: "/crispy-baby-corn.png" },
      { name: "Mango Soufflé", image: "/mango-souffle.png" },
      { name: "Lavender Lemonade Spritz", image: "/lavender-lemonade.png" }
    ];

    for (const u of updates) {
      await Product.updateOne({ name: u.name }, { $set: { image: u.image } });
    }

    console.log("Successfully mapped all 25 images to the production database!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

updateAllImages();
