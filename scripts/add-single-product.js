const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, sparse: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.Mixed, required: true },
  imageUrl: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  originalPrice: { type: Number },
  rating: { type: Number, default: 5 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const productData = {
    name: "Pure Ashwagandha Root Extract 500mg",
    slug: "pure-ashwagandha-root-extract-500mg-" + Date.now(),
    description: "Premium Ashwagandha root extract for stress relief, energy support, and overall wellness. 100% natural and ayurvedic. Helps improve vitality and reduces daily stress levels.",
    price: 499,
    originalPrice: 799,
    category: "Food Supplements", 
    imageUrl: "https://images.unsplash.com/photo-1626244405389-c43916723223?auto=format&fit=crop&w=800&q=80", // Supplements placeholder image
    inStock: true,
    stockCount: 50,
    featured: true,
    rating: 4.8,
    numReviews: 124
  };

  const product = await Product.create(productData);
  console.log("Successfully created product:", product.name);
  console.log("Product ID:", product._id);
  
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
