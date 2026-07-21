require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, sparse: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.Mixed, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    imageUrl: { type: String, required: true },
    imageGallery: { type: [String], default: [] },
    videoUrl: { type: String },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    todayDeal: { type: Boolean, default: false },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5 },
    numReviews: { type: Number, default: 0 },
    sizes: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          originalPrice: { type: Number },
          stock: { type: Number, default: 0 },
        }
      ],
      default: []
    },
    highlights: { type: [String], default: [] },
    ingredients: { type: String },
    benefits: { type: String },
    howToUse: { type: String },
    whoShouldUse: { type: String },
    nutritionTable: { type: mongoose.Schema.Types.Mixed },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    imageAlt: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  {
    name: "Himalayan Shilajit Resin (Gold Grade)",
    slug: "himalayan-shilajit-resin",
    description: "Sourced from the pristine heights of the Himalayas (above 18,000 ft), our pure Shilajit Resin is rich in Fulvic Acid and 84+ essential trace minerals. It acts as a natural rejuvenator, enhancing ATP synthesis to boost stamina, muscle recovery, and overall vitality. Purified using traditional Surya Tapi method.",
    price: 999,
    originalPrice: 1499,
    category: "men",
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584308647960-ef37f7798656?q=80&w=800&auto=format&fit=crop"
    ],
    inStock: true,
    stockCount: 500,
    featured: true,
    todayDeal: true,
    rating: 4.9,
    numReviews: 1245,
    sizes: [
      { name: "20g (1 Month)", price: 999, originalPrice: 1499, stock: 250 },
      { name: "40g (2 Months)", price: 1799, originalPrice: 2899, stock: 250 }
    ],
    highlights: ["100% Pure & Organic", "Contains >60% Fulvic Acid", "Lab Tested for Heavy Metals"],
    ingredients: "100% Pure Himalayan Shilajit (Asphaltum punjabianum) purified by Surya Tapi process.",
    benefits: "Naturally boosts testosterone, increases daily stamina and energy levels, promotes faster muscle recovery, and enhances cognitive function and memory.",
    howToUse: "Take a pea-sized amount (300-500mg) using the provided spoon. Dissolve completely in a glass of warm water or milk. Consume daily on an empty stomach in the morning.",
    whoShouldUse: "Adult men and women experiencing chronic fatigue, active gym-goers seeking muscle recovery, or individuals looking for anti-aging and vitality support."
  },
  {
    name: "Apple Cider Vinegar Gummies with " + "Mother",
    slug: "acv-gummies-mother",
    description: "Get all the benefits of Apple Cider Vinegar without the sour taste! Our delicious ACV Gummies are formulated with the 'Mother' along with added Vitamins B9 and B12. Designed to support weight management, improve gut health, and give a natural boost of daily energy.",
    price: 599,
    originalPrice: 899,
    category: "supplement",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop"
    ],
    inStock: true,
    stockCount: 800,
    featured: true,
    todayDeal: false,
    rating: 4.7,
    numReviews: 320,
    sizes: [
      { name: "30 Gummies", price: 599, originalPrice: 899, stock: 400 },
      { name: "60 Gummies", price: 999, originalPrice: 1599, stock: 400 }
    ],
    highlights: ["100% Vegan & Gelatin-Free", "No Artificial Colors", "Includes Vitamin B12"],
    ingredients: "Apple Cider Vinegar with 'The Mother' (500mg per gummy), Organic Pomegranate, Organic Beetroot, Vitamin B9 (Folic Acid), Vitamin B12, Pectin.",
    benefits: "Reduces bloating and improves digestion, supports healthy weight loss by suppressing appetite, and boosts metabolic function.",
    howToUse: "Take 1-2 gummies daily, preferably 20 minutes before a meal. Chew thoroughly before swallowing.",
    whoShouldUse: "Individuals looking for digestive support, healthy weight management, and those who dislike the taste of liquid ACV."
  },
  {
    name: "Cold-Pressed Aloe Vera + Amla Juice",
    slug: "aloe-vera-amla-juice",
    description: "A powerful detox blend made from freshly harvested Aloe Vera and pure Indian Gooseberry (Amla). Cold-pressed to retain maximum nutrients, this herbal juice acts as a natural cleanser for the blood and liver, promotes glowing skin, and prevents hair fall.",
    price: 349,
    originalPrice: 499,
    category: "care",
    imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=800&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=800&auto=format&fit=crop"
    ],
    inStock: true,
    stockCount: 150,
    featured: false,
    todayDeal: true,
    rating: 4.8,
    numReviews: 540,
    sizes: [
      { name: "1 Liter", price: 349, originalPrice: 499, stock: 150 }
    ],
    highlights: ["No Added Sugar", "Cold-Pressed extracted", "No Synthetic Flavors"],
    ingredients: "Fresh Aloe Vera leaf juice (Barbadensis Miller), Fresh Amla Juice (Emblica officinalis), permitted class II preservatives.",
    benefits: "Provides Vitamin C to boost immunity, improves skin elasticity, aids in daily bowel movements, and strengthens hair follicles.",
    howToUse: "Mix 30ml of the juice in a glass of water. Consume twice daily on an empty stomach for best results. Shake well before use.",
    whoShouldUse: "People suffering from hair fall, skin issues, low immunity, or frequent digestive problems."
  },
  {
    name: "Ashwagandha KSM-66 Premium Extract",
    slug: "ashwagandha-ksm-66-premium-extract",
    description: "Our Ashwagandha KSM-66 is a high-potency, clinically studied adaptogen designed to support stress relief, mental clarity, and physical endurance. Extracted purely from the roots using a unique extraction process that preserves the natural active components.",
    price: 899,
    originalPrice: 1299,
    category: "supplement",
    imageUrl: "https://images.unsplash.com/photo-1584308647960-ef37f7798656?q=80&w=800&auto=format&fit=crop",
    imageGallery: [],
    inStock: true,
    stockCount: 150,
    featured: true,
    todayDeal: true,
    rating: 4.8,
    numReviews: 124,
    sizes: [
      { name: "60 Capsules", price: 899, originalPrice: 1299, stock: 100 },
      { name: "120 Capsules", price: 1599, originalPrice: 2299, stock: 50 }
    ],
    highlights: ["Clinically Proven", "100% Organic", "Vegan Friendly"],
    ingredients: "KSM-66 Ashwagandha Root Extract (Withania somnifera) standardized to 5% withanolides, Organic Black Pepper Extract for absorption.",
    benefits: "Reduces stress and anxiety, improves sleep quality, boosts testosterone in men, and enhances memory and cognition.",
    howToUse: "Take 1-2 capsules daily with water or warm milk after meals.",
    whoShouldUse: "Adults dealing with high stress, looking for muscle recovery, or wanting to improve focus and energy."
  },
  {
    name: "Plant-Based Protein Powder (Chocolate)",
    slug: "plant-based-protein-powder-chocolate",
    description: "A clean, easily digestible 100% plant-based protein powder designed for optimal muscle recovery. Formulated with a blend of pea and brown rice protein, offering a complete amino acid profile. Enhanced with digestive enzymes to prevent bloating.",
    price: 1499,
    originalPrice: 2199,
    category: "supplement",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    imageGallery: [],
    inStock: true,
    stockCount: 300,
    featured: true,
    todayDeal: false,
    rating: 4.6,
    numReviews: 876,
    sizes: [
      { name: "500g", price: 1499, originalPrice: 2199, stock: 200 },
      { name: "1kg", price: 2699, originalPrice: 3899, stock: 100 }
    ],
    highlights: ["25g Protein Per Scoop", "0g Added Sugar", "Includes Digestive Enzymes"],
    ingredients: "Organic Pea Protein Isolate, Brown Rice Protein, Raw Cacao Powder, Stevia Extract, Papain, Bromelain.",
    benefits: "Builds lean muscle mass, accelerates post-workout recovery, meets daily protein requirements cleanly without dairy-induced inflammation.",
    howToUse: "Mix 1 heaping scoop (approx 35g) with 300ml of water or almond milk. Shake well and consume immediately post-workout or as a snack.",
    whoShouldUse: "Vegans, lactose-intolerant individuals, fitness enthusiasts, and anyone looking to increase their daily protein intake cleanly."
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");
    
    console.log("Deleting existing products...");
    await Product.deleteMany({});
    console.log("Deleted existing products.");
    
    console.log("Inserting new Kapiva/Fytika style products...");
    await Product.insertMany(products);
    console.log("Inserted new products successfully.");
    
    process.exit(0);
  } catch (e) {
    console.error("Error seeding products:", e);
    process.exit(1);
  }
}

seed();
