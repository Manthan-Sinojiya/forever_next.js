import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/forever-healthcare";

async function clearProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Define temporary schema/model if not loaded
    const ProductSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

    console.log("Deleting all products from database...");
    const result = await Product.deleteMany({});
    console.log(`Successfully removed products from database:`, result);
  } catch (error) {
    console.error("Error clearing products:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
    process.exit(0);
  }
}

clearProducts();
