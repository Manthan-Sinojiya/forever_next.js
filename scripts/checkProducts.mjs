import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const Product = mongoose.connection.db.collection("products");
    const products = await Product.find({}).toArray();
    
    console.log(`Found ${products.length} products.`);
    if (products.length > 0) {
      console.log("Sample product names:", products.map(p => p.name).slice(0, 5));
      console.log("Missing ingredients count:", products.filter(p => !p.ingredients).length);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
