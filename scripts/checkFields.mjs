import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const Product = mongoose.connection.db.collection("products");
    const products = await Product.find({}).toArray();
    
    products.slice(0, 3).forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`  Ingredients: ${p.ingredients}`);
      console.log(`  Benefits: ${p.benefits}`);
      console.log(`  How To Use: ${p.howToUse}`);
    });

    const missingIngredients = products.filter(p => !p.ingredients || p.ingredients === "");
    const missingBenefits = products.filter(p => !p.benefits || p.benefits === "");
    const missingHowToUse = products.filter(p => !p.howToUse || p.howToUse === "");

    console.log(`Total: ${products.length}`);
    console.log(`Missing Ingredients: ${missingIngredients.length}`);
    console.log(`Missing Benefits: ${missingBenefits.length}`);
    console.log(`Missing How To Use: ${missingHowToUse.length}`);
    
    process.exit(0);
  });
