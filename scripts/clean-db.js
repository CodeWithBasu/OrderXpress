import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanDatabase() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    // List of collections to clear
    const collections = ['products', 'customers', 'feedbacks', 'transactions'];
    
    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`Cleared ${result.deletedCount} items from "${collectionName}" collection.`);
      } catch (err) {
        console.log(`Collection "${collectionName}" might not exist or error clearing: ${err.message}`);
      }
    }

    console.log("Database cleanup complete!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

cleanDatabase();
