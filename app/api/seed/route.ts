import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import HeroSlide from "@/models/HeroSlide";
import bcrypt from "bcryptjs";

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

export async function GET() {
  try {
    await dbConnect();

    // Check & Seed Admin User
    const adminEmail = "admin@foreverhealthcare.in";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      admin = await User.create({
        name: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        phone: "+91 99999 99999",
        city: "Mumbai",
        state: "Maharashtra",
        wishlist: [],
      });
    }

    // Check & Seed Regular User
    const userEmail = "user@foreverhealthcare.in";
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("user123", salt);
      user = await User.create({
        name: "John Doe",
        email: userEmail,
        password: hashedPassword,
        role: "user",
        phone: "+91 98765 43210",
        city: "Mumbai",
        state: "Maharashtra",
        wishlist: [],
      });
    }

    // Recreate Products with local accurate photos
    await Product.deleteMany({});
    await Product.insertMany(productsData);

    // Seed HeroSlides if none exist
    const slideCount = await HeroSlide.countDocuments();
    if (slideCount === 0) {
      await HeroSlide.insertMany(heroSlidesData);
    }

    // Seed Coupons if none exist
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(couponsData);
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with local accurate photos!",
      credentials: {
        admin: {
          email: "admin@foreverhealthcare.in",
          password: "admin123",
          role: "admin"
        },
        user: {
          email: "user@foreverhealthcare.in",
          password: "user123",
          role: "user"
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to seed database"
    }, { status: 500 });
  }
}
