import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const Product = mongoose.connection.db.collection("products");
    const products = await Product.find({}).toArray();

    for (const p of products) {
      if (p.description && p.description.includes("elementor")) {
        console.log(`Cleaning elementor HTML for ${p.name}`);
        const cat = (p.category ? String(p.category) : "").toLowerCase();
        let cleanedDescription = `<p>Experience the pure benefits of <strong>${p.name}</strong>, a premium health solution carefully crafted to integrate seamlessly into your wellness routine. Sourced from high-quality natural ingredients, this product undergoes strict quality checks to ensure efficacy and absolute purity.</p><p>We believe in honest, transparent wellness. Add it to your daily regimen and feel the revitalizing difference over time!</p>`;

        const cleanedShortDesc = `Premium quality ${p.name} sourced from natural ingredients to support your daily wellness journey safely and effectively.`;

        await Product.updateOne(
          { _id: p._id },
          { 
            $set: { 
              description: cleanedDescription,
              shortDescription: cleanedShortDesc
            } 
          }
        );
      }
    }

    console.log("Database description and UI layout issues fixed!");
    process.exit(0);
  });
