import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  todayDeal: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  variants: [{ attribute: String, value: String, price: Number, inventory: Number }],
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

const bulkDemoProducts = [
  {
    name: "Pure Ashwagandha Extra Strength",
    category: "Food Supplements",
    price: 499,
    originalPrice: 799,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    description: "Premium grade ashwagandha supplement for stress relief and vitality. Made with 100% natural organic roots, offering a potent 500mg dose per capsule. Promotes healthy cortisol levels, reduces fatigue, and boosts overall stamina. Contains no artificial fillers or binders.",
    inStock: true,
    featured: true,
    todayDeal: false,
    status: "active",
    variants: [
      { attribute: "Size", value: "30 Capsules", price: 299, inventory: 150 },
      { attribute: "Size", value: "60 Capsules", price: 499, inventory: 100 },
      { attribute: "Size", value: "120 Capsules", price: 899, inventory: 80 }
    ],
  },
  {
    name: "Triphala Digestive Detox",
    category: "Food Supplements",
    price: 349,
    originalPrice: 599,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "Ayurvedic Triphala blend formulated to gently cleanse the digestive tract, relieve constipation, and enhance nutrient absorption. A balancing mix of Amalaki, Bibhitaki, and Haritaki. Ideal for daily detox and immune support.",
    inStock: true,
    featured: false,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Size", value: "60 Tablets", price: 349, inventory: 200 },
      { attribute: "Size", value: "120 Tablets", price: 599, inventory: 100 }
    ],
  },
  {
    name: "Advanced Digital Blood Pressure Monitor",
    category: "Healthcare Equipments",
    price: 1899,
    originalPrice: 2499,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
    description: "Clinically validated automatic blood pressure monitor for home use. Features a large, easy-to-read LCD display, irregular heartbeat detection, and a memory function that stores up to 90 readings. Includes a comfortable wide-range cuff fitting standard to large adult arms.",
    inStock: true,
    featured: true,
    todayDeal: false,
    status: "active",
    variants: [
      { attribute: "Type", value: "Standard Unit", price: 1899, inventory: 50 },
      { attribute: "Type", value: "Family Unit (With Case)", price: 2299, inventory: 30 }
    ],
  },
  {
    name: "Complete Daily Multivitamin for Men",
    category: "Men Health",
    price: 899,
    originalPrice: 1299,
    imageUrl: "https://images.unsplash.com/photo-1584308647960-ef37f7798656?q=80&w=800&auto=format&fit=crop",
    description: "A comprehensive daily multivitamin formulated specifically for men. Includes essential vitamins, minerals, and antioxidants to support heart health, immune function, and energy metabolism. Contains Vitamin D3, B-Complex, Zinc, and Selenium for optimal male wellness.",
    inStock: true,
    featured: true,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Size", value: "60 Tablets", price: 499, inventory: 120 },
      { attribute: "Size", value: "120 Tablets", price: 899, inventory: 60 }
    ],
  },
  {
    name: "Organic Amla & Aloe Vera Juice",
    category: "Ayurvedic Juices",
    price: 350,
    originalPrice: 500,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "100% natural and organic Amla and Aloe Vera juice cold-pressed to retain maximum nutrients. Rich in Vitamin C, antioxidants, and digestive enzymes. Helps in detoxifying the body, boosting immunity, improving digestion, and maintaining healthy skin and hair.",
    inStock: true,
    featured: false,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Volume", value: "500 ml", price: 350, inventory: 150 },
      { attribute: "Volume", value: "1 Liter", price: 599, inventory: 80 }
    ],
  },
  {
    name: "Intensive Hydration Night Cream",
    category: "Personal Care",
    price: 650,
    originalPrice: 950,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "Deeply nourishing night cream formulated with hyaluronic acid, ceramides, and natural botanical extracts. Restores skin moisture barrier while you sleep, reducing the appearance of fine lines and leaving your skin feeling soft, plump, and rejuvenated by morning. Dermatologist tested.",
    inStock: true,
    featured: true,
    todayDeal: false,
    status: "active",
    variants: [
      { attribute: "Weight", value: "50g", price: 650, inventory: 75 },
      { attribute: "Weight", value: "100g", price: 1100, inventory: 40 }
    ],
  },
  {
    name: "Fingertip Pulse Oximeter PRO",
    category: "Healthcare Equipments",
    price: 1200,
    originalPrice: 1500,
    imageUrl: "https://images.unsplash.com/photo-1584308647960-ef37f7798656?q=80&w=800&auto=format&fit=crop",
    description: "Accurate and reliable fingertip pulse oximeter for measuring blood oxygen saturation levels (SpO2) and pulse rate. Features a bright OLED display with multi-directional viewing. Ideal for sports enthusiasts, aviators, or anyone needing to monitor their oxygen levels on the go.",
    inStock: true,
    featured: false,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Type", value: "Standard Unit", price: 1200, inventory: 200 }
    ],
  },
  {
    name: "Shilajit Resin for Vitality",
    category: "Men Health",
    price: 1299,
    originalPrice: 2000,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    description: "Pure Himalayan Shilajit resin containing over 80 trace minerals and rich fulvic acid. Known significantly to boost testosterone, stamina, and cellular energy levels. Sourced directly from above 16000ft altitudes.",
    inStock: true,
    featured: true,
    todayDeal: false,
    status: "active",
    variants: [
      { attribute: "Weight", value: "15g", price: 999, inventory: 90 },
      { attribute: "Weight", value: "20g", price: 1299, inventory: 150 },
      { attribute: "Weight", value: "50g", price: 2599, inventory: 50 },
    ],
  },
  {
    name: "Giloy Neem Immunity Juice",
    category: "Ayurvedic Juices",
    price: 249,
    originalPrice: 399,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "Powerful combination of Neem, Tulsi, and Giloy optimized to defend against respiratory ailments, allergies, and infections. Acts as an impressive blood purifier when consumed regularly on an empty stomach.",
    inStock: true,
    featured: false,
    todayDeal: false,
    status: "active",
    variants: [
      { attribute: "Volume", value: "500 ml", price: 249, inventory: 150 },
      { attribute: "Volume", value: "1 Liter", price: 420, inventory: 120 }
    ],
  },
  {
    name: "Vitamin C Brightening Face Serum",
    category: "Personal Care",
    price: 799,
    originalPrice: 1199,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "Highly concentrated 20% Vitamin C serum infused with Hyaluronic Acid and Ferulic acid. Protects against photo-aging while visibly brightening dark spots, promoting collagen synthesis and leaving the skin youthfully radiant.",
    inStock: true,
    featured: true,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Volume", value: "30 ml", price: 499, inventory: 250 },
      { attribute: "Volume", value: "50 ml", price: 799, inventory: 150 }
    ],
  },
  {
    name: "Electromagnetic Wave Pulse Massager",
    category: "Healthcare Equipments",
    price: 2500,
    originalPrice: 3200,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
    description: "Advanced Tens machine providing electromagnetic nerve stimulation. Great for chronic nerve pain, muscle tension relief, and improved blood circulation. Comes with 8 self-adhesive conductive pads and multiple intensity modes.",
    inStock: true,
    featured: false,
    todayDeal: true,
    status: "active",
    variants: [
      { attribute: "Type", value: "Standard Unit (4 Pads)", price: 1800, inventory: 100 },
      { attribute: "Type", value: "Pro Unit (8 Pads)", price: 2500, inventory: 60 }
    ],
  }
];

async function seedHealthcareBulk() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/forever-healthcare";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for Bulk Seeding.");

    console.log("Inserting 11 healthcare products with variants...");
    await Product.insertMany(bulkDemoProducts);

    console.log("Successfully appended 11 products with multiple sizes/prices!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedHealthcareBulk();
