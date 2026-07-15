import mongoose from "mongoose";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/forever-healthcare";

// Schemas
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    todayDeal: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: "Shop Now" },
  buttonLink: { type: String, default: "/products" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
  minPurchase: { type: Number, default: 0 },
  description: { type: String, required: true },
  expiryDate: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const HeroSlide = mongoose.models.HeroSlide || mongoose.model("HeroSlide", HeroSlideSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String },
    city: { type: String },
    state: { type: String },
    wishlist: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const productsData = [
  {
    name: "Pure Ashwagandha Extract 500mg",
    description: "Premium Ayurvedic supplement for stress relief, anxiety reduction, and enhanced daily vitality.",
    price: 20,
    originalPrice: 26,
    category: "Food Supplements",
    imageUrl: "/products/ashwagandha.png",
    inStock: true,
    featured: true,
    todayDeal: true,
    rating: 5,
  },
  {
    name: "Vitamin C & Zinc Immunity Boosters",
    description: "Daily chewable tablets to keep your immune system strong year-round against common colds.",
    price: 15,
    originalPrice: 21,
    category: "Food Supplements",
    imageUrl: "/products/vitamin-c-zinc.png",
    inStock: true,
    featured: true,
    todayDeal: false,
    rating: 4.8,
  },
  {
    name: "Digital Blood Pressure Monitor",
    description: "Highly accurate digital blood pressure and heart rate monitor for home use. Features memory storage.",
    price: 46,
    originalPrice: 60,
    category: "Healthcare Equipments",
    imageUrl: "/products/bp-monitor.png",
    inStock: true,
    featured: true,
    todayDeal: false,
    rating: 4.8,
  },
  {
    name: "Fingertip Pulse Oximeter",
    description: "Instant SpO2 and pulse rate readings. Essential for home respiratory monitoring.",
    price: 19,
    originalPrice: 25,
    category: "Healthcare Equipments",
    imageUrl: "/products/pulse-oximeter.png",
    inStock: true,
    featured: true,
    todayDeal: true,
    rating: 4.9,
  },
  {
    name: "Men's Vitality Booster Capsules",
    description: "Natural wellness supplement specifically formulated for men's daily energy and health.",
    price: 30,
    originalPrice: 44,
    category: "Men Health",
    imageUrl: "/products/vitality-capsules.png",
    inStock: true,
    featured: true,
    todayDeal: false,
    rating: 4.5,
  },
  {
    name: "Digital Blood Glucose Meter Kit",
    description: "A comprehensive glucose testing kit with painless lancing device and 25 test strips.",
    price: 35,
    originalPrice: 55,
    category: "Healthcare Equipments",
    imageUrl: "/products/glucose-meter.png",
    inStock: true,
    featured: true,
    todayDeal: false,
    rating: 4.7,
  },
  {
    name: "Orthopedic Knee Support Brace",
    description: "Provides exceptional stability, compression, and comfort for injured or weak knees.",
    price: 22,
    originalPrice: 32,
    category: "Orthopedic Care",
    imageUrl: "/products/knee-support.png",
    inStock: true,
    featured: true,
    todayDeal: false,
    rating: 4.6,
  },
  {
    name: "Infrared Forehead Thermometer",
    description: "Non-contact medical-grade thermometer for instant, accurate temperature readings.",
    price: 28,
    originalPrice: 40,
    category: "Healthcare Equipments",
    imageUrl: "/products/thermometer.png",
    inStock: true,
    featured: false,
    todayDeal: false,
    rating: 4.9,
  },
  {
    name: "Premium First Aid Kit",
    description: "Fully stocked first aid kit with 150 essential medical-grade supplies for home and travel.",
    price: 18,
    originalPrice: 25,
    category: "First Aid",
    imageUrl: "/products/first-aid.png",
    inStock: true,
    featured: false,
    todayDeal: false,
    rating: 4.8,
  }
];

const heroSlidesData = [
  {
    title: "100% Organic Ayurvedic Health Solutions",
    subtitle: "Authentic Herbs & Natural Supplements Direct from Himalayan Valleys",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Explore Ayurveda",
    buttonLink: "/products",
    order: 1,
  },
  {
    title: "Premium Home Healthcare Equipment",
    subtitle: "Up to 40% Off on Certified BP Monitors, Oximeters & Nebulizers",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Shop Equipment",
    buttonLink: "/products",
    order: 2,
  },
  {
    title: "Vitals & Nutritional Wellness",
    subtitle: "Daily Multivitamins, Fish Oils & Stamina Boosters",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Get Nutrition",
    buttonLink: "/products",
    order: 3,
  }
];

const couponsData = [
  {
    code: "AYUR10",
    discount: 10,
    discountType: "percentage",
    minPurchase: 499,
    description: "Get 10% OFF on all Ayurvedic Supplements! Minimum purchase ₹499.",
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    code: "HEALTH50",
    discount: 50,
    discountType: "fixed",
    minPurchase: 299,
    description: "Save ₹50 flat on your first order. Minimum purchase ₹299.",
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    code: "FREESHIP",
    discount: 100,
    discountType: "percentage",
    minPurchase: 999,
    description: "Get Free Shipping + 10% Extra Discount on orders above ₹999.",
    expiryDate: "2026-12-31",
    isActive: true,
  }
];

async function seedDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    console.log("Clearing collections...");
    await Product.deleteMany({});
    await HeroSlide.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});

    console.log("Inserting Products...");
    await Product.insertMany(productsData);

    console.log("Inserting Hero Slides...");
    await HeroSlide.insertMany(heroSlidesData);

    console.log("Inserting Coupons...");
    await Coupon.insertMany(couponsData);

    console.log("Inserting Default User Accounts...");
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedUserPassword = await bcrypt.hash("user123", salt);

    await User.create([
      {
        name: "Administrator",
        email: "admin@foreverhealthcare.in",
        password: hashedAdminPassword,
        role: "admin",
        phone: "+91 99999 99999",
        city: "Mumbai",
        state: "Maharashtra",
        wishlist: [],
      },
      {
        name: "John Doe",
        email: "user@foreverhealthcare.in",
        password: hashedUserPassword,
        role: "user",
        phone: "+91 98765 43210",
        city: "Mumbai",
        state: "Maharashtra",
        wishlist: [],
      }
    ]);
    
    console.log("Database seeded successfully with Users, Products, Banners, and Coupons!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedDB();
