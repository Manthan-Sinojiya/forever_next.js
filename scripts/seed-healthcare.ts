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
  sizes: [{ name: String, price: Number, originalPrice: Number, stock: Number }],
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

const predefinedCategories = [
  "Food Supplements",
  "Healthcare Equipments",
  "Men Health",
  "Personal Care",
  "Ayurvedic Juices",
];

const demoProducts = [
  {
    name: "Pure Ashwagandha Extract 500mg",
    category: "Food Supplements",
    price: 499,
    originalPrice: 799,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    description: "Premium grade ashwagandha supplement for stress relief and vitality. Made with 100% natural organic roots, offering a potent 500mg dose per capsule. Promotes healthy cortisol levels, reduces fatigue, and boosts overall stamina. Contains no artificial fillers or binders.",
    inStock: true,
    featured: true,
    todayDeal: false,
    sizes: [{ name: "60 Capsules", price: 499, originalPrice: 799, stock: 100 }],
  },
  {
    name: "Complete Daily Multivitamin for Men",
    category: "Men Health",
    price: 899,
    originalPrice: 1299,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
    description: "A comprehensive daily multivitamin formulated specifically for men. Includes essential vitamins, minerals, and antioxidants to support heart health, immune function, and energy metabolism. Contains Vitamin D3, B-Complex, Zinc, and Selenium for optimal male wellness.",
    inStock: true,
    featured: true,
    todayDeal: true,
    sizes: [{ name: "120 Tablets", price: 899, originalPrice: 1299, stock: 50 }],
  },
  {
    name: "Advanced Digital Blood Pressure Monitor",
    category: "Healthcare Equipments",
    price: 1899,
    originalPrice: 2499,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop",
    description: "Clinically validated automatic blood pressure monitor for home use. Features a large, easy-to-read LCD display, irregular heartbeat detection, and a memory function that stores up to 90 readings. Includes a comfortable wide-range cuff fitting standard to large adult arms.",
    inStock: true,
    featured: false,
    todayDeal: false,
    sizes: [{ name: "Standard Unit", price: 1899, originalPrice: 2499, stock: 20 }],
  },
  {
    name: "Organic Amla & Aloe Vera Juice",
    category: "Ayurvedic Juices",
    price: 299,
    originalPrice: 450,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    description: "100% natural and organic Amla and Aloe Vera juice cold-pressed to retain maximum nutrients. Rich in Vitamin C, antioxidants, and digestive enzymes. Helps in detoxifying the body, boosting immunity, improving digestion, and maintaining healthy skin and hair.",
    inStock: true,
    featured: false,
    todayDeal: true,
    sizes: [{ name: "500 ml", price: 299, originalPrice: 450, stock: 150 }],
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
    sizes: [{ name: "50g", price: 650, originalPrice: 950, stock: 75 }],
  },
  {
    name: "Fingertip Pulse Oximeter",
    category: "Healthcare Equipments",
    price: 1200,
    originalPrice: 1500,
    imageUrl: "https://images.unsplash.com/photo-1584308647960-ef37f7798656?q=80&w=800&auto=format&fit=crop",
    description: "Accurate and reliable fingertip pulse oximeter for measuring blood oxygen saturation levels (SpO2) and pulse rate. Features a bright OLED display with multi-directional viewing. Ideal for sports enthusiasts, aviators, or anyone needing to monitor their oxygen levels on the go.",
    inStock: true,
    featured: false,
    todayDeal: true,
    sizes: [{ name: "Standard Unit", price: 1200, originalPrice: 1500, stock: 200 }],
  }
];

async function seedHealthcare() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/forever-healthcare";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing products and categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("Inserting categories...");
    const categoryDocs = predefinedCategories.map(name => ({
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      isActive: true
    }));
    await Category.insertMany(categoryDocs);

    console.log("Inserting healthcare demo products...");
    await Product.insertMany(demoProducts);

    console.log("Successfully seeded healthcare demo data!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedHealthcare();
