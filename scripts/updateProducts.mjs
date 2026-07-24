import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const productDataMap = {
  "Moringa tablet": {
    ingredients: "<ul><li>Pure Moringa Oleifera Leaf Extract</li><li>Binding agents (excipients)</li></ul>",
    benefits: "<p>Rich in essential vitamins and minerals, Moringa tablets boost immunity, improve stamina, and support healthy digestion. It acts as a natural antioxidant to combat free radicals in the body.</p>",
    howToUse: "<p>Take 1-2 tablets daily with water after meals, or as directed by your healthcare professional.</p>"
  },
  "Electronic Pulse Massager": {
    ingredients: "<p><em>Not applicable for electronic devices.</em></p>",
    benefits: "<p>Alleviates muscle tension, improves blood circulation, and provides targeted pain relief using low-frequency electronic pulses. Perfect for post-workout recovery or daily relaxation.</p>",
    howToUse: "<p>Place the adhesive gel pads on the affected body part. Power on the device, select your desired massage mode, and adjust the intensity to a comfortable level. Use for 15-20 minutes.</p>"
  },
  "Aloevera Juice": {
    ingredients: "<ul><li>99% Pure Aloe Vera Barbadensis Leaf Juice</li><li>Natural preservatives (Citric Acid)</li></ul>",
    benefits: "<p>Promotes healthy digestion, detoxifies the body, and supports a glowing complexion. Aloe Vera is known to balance stomach acid and hydrate the body from the inside out.</p>",
    howToUse: "<p>Mix 30ml of Aloe Vera Juice in a glass of lukewarm water. Consume daily on an empty stomach in the morning for best results.</p>"
  },
  "BP Bliss juice": {
    ingredients: "<ul><li>Arjuna Bark Extract</li><li>Garlic</li><li>Sarpagandha</li><li>Ashwagandha</li></ul>",
    benefits: "<p>Specially formulated to help maintain normal blood pressure levels. It supports cardiovascular health, reduces stress and anxiety, and promotes healthy blood circulation.</p>",
    howToUse: "<p>Mix 15-20ml of BP Bliss Juice with half a cup of water. Drink twice a day before meals.</p>"
  },
  "Cholobits Juice": {
    ingredients: "<ul><li>Garlic (Lashun)</li><li>Ginger (Adrak)</li><li>Lemon</li><li>Apple Cider Vinegar</li><li>Honey</li></ul>",
    benefits: "<p>Helps in managing cholesterol levels naturally. It aids in clearing arteries, improving lipid profiles, and boosting overall heart function and metabolism.</p>",
    howToUse: "<p>Take 10-15ml mixed with warm water every morning on an empty stomach.</p>"
  },
  "Kansa Vatki Foot Massager": {
    ingredients: "<p><em>Made of authentic Kansa (Bronze) alloy.</em></p>",
    benefits: "<p>Revitalizes tired feet, balances body doshas (Vata, Pitta, Kapha), improves blood circulation, and promotes deep relaxation and better sleep.</p>",
    howToUse: "<p>Apply a little oil (like coconut or sesame oil) to the soles of your feet. Glide the Kansa Vatki over the feet in circular motions for 10-15 minutes.</p>"
  },
  "Livbites Juice": {
    ingredients: "<ul><li>Bhumi Amla</li><li>Kalmegh</li><li>Kutki</li><li>Punarnava</li><li>Aloe Vera</li></ul>",
    benefits: "<p>Acts as a powerful liver tonic. It helps in detoxifying the liver, protecting against hepatic disorders, and improving digestion and appetite.</p>",
    howToUse: "<p>Consume 20ml of Livbites Juice diluted with water, twice a day before meals.</p>"
  },
  "GlucoFix Juice": {
    ingredients: "<ul><li>Karela (Bitter Gourd)</li><li>Jamun</li><li>Gudmar</li><li>Neem</li><li>Amla</li></ul>",
    benefits: "<p>Designed to help regulate blood sugar levels naturally. It stimulates insulin secretion, reduces sugar cravings, and provides an energy boost.</p>",
    howToUse: "<p>Mix 30ml in a glass of water and consume on an empty stomach every morning.</p>"
  },
  "BullXtra Capsule": {
    ingredients: "<ul><li>Shilajit</li><li>Safed Musli</li><li>Ashwagandha</li><li>Gokshura</li><li>Kaunch Beej</li></ul>",
    benefits: "<p>A premium masculine vitality booster. Improves stamina, enhances strength, reduces fatigue, and supports overall reproductive health in men.</p>",
    howToUse: "<p>Take 1 capsule twice daily with milk or warm water, preferably after meals.</p>"
  },
  "Wheat Grass Juice": {
    ingredients: "<ul><li>100% Organic Wheatgrass Extract</li><li>Chlorophyll</li></ul>",
    benefits: "<p>A superfood packed with vitamins and minerals. It boosts the immune system, detoxifies the body, improves hemoglobin levels, and aids in weight management.</p>",
    howToUse: "<p>Mix 30ml of Wheatgrass juice with water. Drink in the morning on an empty stomach.</p>"
  },
  "Ayush Plus Tablet": {
    ingredients: "<ul><li>Tulsi</li><li>Dalchini (Cinnamon)</li><li>Sunthi (Ginger)</li><li>Krishna Marich (Black Pepper)</li></ul>",
    benefits: "<p>A potent immunity booster that helps protect against common coughs, colds, and viral infections. Promotes respiratory health.</p>",
    howToUse: "<p>Take 1-2 tablets daily with warm water or crush and mix with honey.</p>"
  },
  "Moringa Powder": {
    ingredients: "<ul><li>100% Organic Sun-Dried Moringa Leaves</li></ul>",
    benefits: "<p>Rich in proteins, vitamins, and minerals. Enhances stamina, supports joint health, improves lactation in mothers, and promotes healthy skin.</p>",
    howToUse: "<p>Mix 1 teaspoon of powder in warm water, smoothies, or sprinkle on salads daily.</p>"
  },
  "Blood Circulation Machine": {
    ingredients: "<p><em>Not applicable</em></p>",
    benefits: "<p>Uses high-frequency spiral vibration to enhance blood circulation, relieve muscle fatigue, reduce weight, and promote overall wellness.</p>",
    howToUse: "<p>Stand or sit with feet on the machine base. Use for 10-15 minutes daily. Follow the manual for specific acupressure targeting.</p>"
  },
  "Electromagnetic Foot Massager": {
    ingredients: "<p><em>Not applicable</em></p>",
    benefits: "<p>Combines electromagnetic therapy and reflexology to relieve foot neuropathy, reduce swelling, and promote better blood flow in the lower limbs.</p>",
    howToUse: "<p>Place bare feet on the footplates, turn on the device, select intensity, and use for 20-30 minutes.</p>"
  },
  "Magnetic Bracelet": {
    ingredients: "<p><em>Stainless steel or titanium with bio-magnets.</em></p>",
    benefits: "<p>Magnetic therapy is believed to improve circulation, reduce joint pain, alleviate arthritis symptoms, and balance body energy levels.</p>",
    howToUse: "<p>Wear continuously on the wrist. Ensure it fits snugly but comfortably.</p>"
  },
  "Smart Scale": {
    ingredients: "<p><em>Not applicable</em></p>",
    benefits: "<p>Provides full body composition analysis including weight, BMI, body fat percentage, muscle mass, and water content. Connects via Bluetooth to tracking apps.</p>",
    howToUse: "<p>Step on the scale barefoot. Ensure the app is open on your smartphone to sync the data instantly.</p>"
  },
  "Neck Shoulder Massager": {
    ingredients: "<p><em>Not applicable</em></p>",
    benefits: "<p>Relieves deep tissue tension, soothes neck and shoulder stiffness, and comes with optional heat therapy for accelerated muscle recovery.</p>",
    howToUse: "<p>Drape around your neck and shoulders, secure arms in the loops, turn on, and adjust heat/rhythm. Use for 15 minutes.</p>"
  },
  "Multivitamin Tablet": {
    ingredients: "<ul><li>Vitamin A, C, D, E, B-Complex</li><li>Zinc, Magnesium, Iron, Calcium</li><li>Antioxidant blends</li></ul>",
    benefits: "<p>Fills nutritional gaps in your daily diet, boosts energy levels, supports bone health, and strengthens the immune system for active lifestyles.</p>",
    howToUse: "<p>Take 1 tablet daily, preferably with breakfast or a major meal.</p>"
  },
  "Re-new-v Cream": {
    ingredients: "<ul><li>Natural Essential Oils</li><li>Aloe Extract</li><li>Vitamin E</li><li>Skin rejuvenating herbs</li></ul>",
    benefits: "<p>A premium revitalization cream that deeply moisturizes, reduces signs of aging, and restores skin elasticity for a youthful glow.</p>",
    howToUse: "<p>Apply a pea-sized amount to clean, dry skin. Massage gently in upward circular motions until fully absorbed. Use twice daily.</p>"
  }
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const Product = mongoose.connection.db.collection("products");
    const products = await Product.find({}).toArray();
    
    for (const p of products) {
      if (productDataMap[p.name]) {
        await Product.updateOne(
          { _id: p._id },
          { 
            $set: { 
              ingredients: productDataMap[p.name].ingredients,
              benefits: productDataMap[p.name].benefits,
              howToUse: productDataMap[p.name].howToUse
            } 
          }
        );
        console.log(`Updated: ${p.name}`);
      } else {
        // generic fallback
        await Product.updateOne(
          { _id: p._id },
          { 
            $set: { 
              ingredients: "<ul><li>Proprietary Ayurvedic Blend</li><li>Natural Extracts</li></ul>",
              benefits: "<p>Supports overall wellness and vitality with natural ingredients.</p>",
              howToUse: "<p>Use as directed by your healthcare provider.</p>"
            } 
          }
        );
        console.log(`Updated (Fallback): ${p.name}`);
      }
    }
    
    console.log("All products updated with proper Ingredients, Key Benefits, and How To Use.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
