import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const Product = mongoose.connection.db.collection("products");
    
    await Product.updateOne(
      { name: "Ayush Plus tablet" },
      { $set: { 
          ingredients: "<ul><li>Tulsi</li><li>Dalchini (Cinnamon)</li><li>Sunthi (Ginger)</li><li>Krishna Marich (Black Pepper)</li></ul>",
          benefits: "<p>A potent immunity booster that helps protect against common coughs, colds, and viral infections. Promotes respiratory health.</p>",
          howToUse: "<p>Take 1-2 tablets daily with warm water or crush and mix with honey.</p>"
      }}
    );

    await Product.updateOne(
      { name: "Blood Circulation Machine (BCM)" },
      { $set: { 
          ingredients: "<p><em>Not applicable</em></p>",
          benefits: "<p>Uses high-frequency spiral vibration to enhance blood circulation, relieve muscle fatigue, reduce weight, and promote overall wellness.</p>",
          howToUse: "<p>Stand or sit with feet on the machine base. Use for 10-15 minutes daily. Follow the manual for specific acupressure targeting.</p>"
      }}
    );

    await Product.updateOne(
      { name: "Neck &#038; Shoulder Massager" },
      { $set: { 
          ingredients: "<p><em>Not applicable</em></p>",
          benefits: "<p>Relieves deep tissue tension, soothes neck and shoulder stiffness, and comes with optional heat therapy for accelerated muscle recovery.</p>",
          howToUse: "<p>Drape around your neck and shoulders, secure arms in the loops, turn on, and adjust heat/rhythm. Use for 15 minutes.</p>"
      }}
    );

    await Product.updateOne(
      { name: "Electromagnetic Foot Massager Wave Pulse MassageMachine" },
      { $set: { 
          ingredients: "<p><em>Not applicable</em></p>",
          benefits: "<p>Combines electromagnetic therapy and reflexology to relieve foot neuropathy, reduce swelling, and promote better blood flow in the lower limbs.</p>",
          howToUse: "<p>Place bare feet on the footplates, turn on the device, select intensity, and use for 20-30 minutes.</p>"
      }}
    );

    await Product.updateOne(
      { name: "Kansa Vatki Foot massager" },
      { $set: { 
          ingredients: "<p><em>Made of authentic Kansa (Bronze) alloy.</em></p>",
          benefits: "<p>Revitalizes tired feet, balances body doshas (Vata, Pitta, Kapha), improves blood circulation, and promotes deep relaxation and better sleep.</p>",
          howToUse: "<p>Apply a little oil (like coconut or sesame oil) to the soles of your feet. Glide the Kansa Vatki over the feet in circular motions for 10-15 minutes.</p>"
      }}
    );

    await Product.updateOne(
      { name: "Re-New-V-cream" },
      { $set: { 
          ingredients: "<ul><li>Natural Essential Oils</li><li>Aloe Extract</li><li>Vitamin E</li><li>Skin rejuvenating herbs</li></ul>",
          benefits: "<p>A premium revitalization cream that deeply moisturizes, reduces signs of aging, and restores skin elasticity for a youthful glow.</p>",
          howToUse: "<p>Apply a pea-sized amount to clean, dry skin. Massage gently in upward circular motions until fully absorbed. Use twice daily.</p>"
      }}
    );

    console.log("Remaining products updated with proper fields.");
    process.exit(0);
  });
