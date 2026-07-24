import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Category from "@/models/Category";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Review from "@/models/Review";
import ContactMessage from "@/models/ContactMessage";
import CustomPage from "@/models/CustomPage";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();

    // 1. Clear ALL collections completely
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await ContactMessage.deleteMany({});
    await CustomPage.deleteMany({});
    await Testimonial.deleteMany({});
    
    // Also clear new CMS models if they exist in this connection context
    try {
      const { Menu } = await import("@/models/Menu");
      const { Setting } = await import("@/models/Setting");
      const { Banner } = await import("@/models/Banner");
      const { CmsSection } = await import("@/models/CmsSection");
      await Menu.deleteMany({});
      await Setting.deleteMany({});
      await Banner.deleteMany({});
      await CmsSection.deleteMany({});
    } catch (e) {
      console.log("CMS models not yet initialized or failed to clear", e);
    }

    // 2. Seed Categories (Food Supplements, Healthcare Equipments, Men Health, Personal Care)
    const categoryData = [
      { name: "Food Supplements", slug: "food-supplements", description: "Dietary supplements for optimal health", status: "active", image: "/categories/food-supplements.png" },
      { name: "Healthcare Equipments", slug: "healthcare-equipments", description: "Medical devices and equipment", status: "active", image: "/categories/healthcare.png" },
      { name: "Men Health", slug: "men-health", description: "Products tailored for men's health", status: "active", image: "/categories/men-health.png" },
      { name: "Personal Care", slug: "personal-care", description: "Hygiene and personal care items", status: "active", image: "/categories/personal-care.png" }
    ];
    const savedCategories = await Category.insertMany(categoryData);

    // 3. Dynamically Fetch Products from foreverhealthcare.in
    let productData: any[] = [];
    try {
      const wpResponse = await fetch("https://foreverhealthcare.in/wp-json/wp/v2/product?per_page=100", {
        headers: { "Accept": "application/json" }
      });
      
      if (wpResponse.ok) {
        const wpProducts = await wpResponse.json();
        
        // Map WP Products to our MongoDB Product Schema
        productData = wpProducts.map((wp: any) => {
          // Attempt to extract text from HTML content for shortDescription
          const cleanDesc = wp.content?.rendered?.replace(/<[^>]+>/g, '') || "";
          
          return {
            name: wp.title?.rendered || "Unknown Product",
            slug: wp.slug || `product-${Math.floor(Math.random()*10000)}`,
            category: savedCategories[Math.floor(Math.random() * savedCategories.length)]._id, // Randomly assign to one of the 4 categories
            mrp: 999, // WP free API might not expose WooCommerce price easily
            price: 799,
            inventory: 100,
            inStock: true,
            description: wp.content?.rendered || "No description available",
            shortDescription: cleanDesc.substring(0, 150) + "...",
            ingredients: "Various Ayurvedic Herbs",
            benefits: "Promotes overall well-being",
            howToUse: "Use as directed.",
            status: "active",
            images: [
              // Use WP featured image if available, else simulate broken image to trigger fallback logo
              { url: wp.yoast_head_json?.og_image?.[0]?.url || "/products/missing-image-test.png" }
            ],
            isBestSeller: Math.random() > 0.5,
            todayDeal: Math.random() > 0.5,
            metaTitle: wp.title?.rendered || "Product",
            metaDescription: cleanDesc.substring(0, 150),
            metaKeywords: "ayurveda, health, supplement"
          };
        });
      } else {
        console.warn("Failed to fetch products from live API, falling back to empty.");
      }
    } catch (e) {
      console.error("Error fetching live products:", e);
    }

    if (productData.length === 0) {
       // Fallback to at least 1 product if the API is completely down/blocked
       productData = [{
          name: "Premium Ashwagandha Extract 500mg",
          slug: "premium-ashwagandha-extract-500mg",
          category: savedCategories[0]._id,
          mrp: 599,
          price: 499,
          inventory: 150,
          inStock: true,
          description: "<p>Experience the power of nature with our <b>Premium Ashwagandha Extract</b>.</p>",
          shortDescription: "Relieve stress and boost vitality.",
          ingredients: "Organic Ashwagandha",
          benefits: "Reduces stress and anxiety",
          howToUse: "Take 1 capsule twice daily",
          status: "active",
          images: [{ url: "/products/ashwagandha.png" }],
          isBestSeller: true,
          todayDeal: true,
          metaTitle: "Buy Premium Ashwagandha",
          metaDescription: "Relieve stress and boost vitality.",
          metaKeywords: "ashwagandha, stress relief"
       }];
    }

    let savedProducts: any[] = [];
    if (productData.length > 0) {
        savedProducts = await Product.insertMany(productData);
    }

    // 4. Seed Users
    const user1 = new User({
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      city: "Mumbai",
      state: "Maharashtra"
    });
    const savedUsers = await User.insertMany([user1]);

    // 5. Seed Orders
    const order1 = new Order({
      orderNumber: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      user: savedUsers[0]._id,
      items: [
        {
          productId: savedProducts.length > 0 ? savedProducts[0]._id : new mongoose.Types.ObjectId(),
          name: savedProducts.length > 0 ? savedProducts[0].name : "Unknown Product",
          price: savedProducts.length > 0 ? savedProducts[0].price : 499,
          qty: 2
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "9876543210",
        addressLine: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001"
      },
      pricing: {
        subtotal: 998,
        tax: 50,
        total: 1048
      },
      paymentStatus: "paid",
      orderStatus: "shipping"
    });
    await order1.save();

    // 6. Seed Reviews
    const review1 = new Review({
      productId: savedProducts.length > 0 ? savedProducts[0]._id.toString() : new mongoose.Types.ObjectId().toString(),
      userName: "Alice Smith",
      userEmail: "alice@example.com",
      rating: 5,
      comment: "Excellent product, really helps with stress!",
      status: "Approved"
    });
    await review1.save();

    // 7. Seed Contact Messages
    const contact1 = new ContactMessage({
      fullName: "Bob Johnson",
      email: "bob@example.com",
      subject: "Bulk Order Inquiry",
      message: "I would like to place a bulk order for Ashwagandha. Please contact me.",
      status: "new"
    });
    await contact1.save();

    // 8. Seed Custom Pages
    const customPage1 = new CustomPage({
      title: "About Us",
      slug: "about-us",
      content: "<p>Welcome to Forever Healthcare! We are dedicated to providing the best Ayurvedic and medical products.</p>",
      status: "published"
    });
    
    const customPage2 = new CustomPage({
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: "<p>Your privacy is important to us. This policy explains how we handle your data.</p>",
      status: "published"
    });
    await CustomPage.insertMany([customPage1, customPage2]);

    // 9. Seed Testimonials
    const testimonial1 = new Testimonial({
      customerName: "Sarah Connor",
      rating: 5,
      review: "The BP monitor is very accurate and easy to use. Highly recommend Forever Healthcare!",
      status: "active",
      isFeatured: true
    });
    await testimonial1.save();

    // 10. Seed CMS Menus and Settings
    try {
      const { Menu } = await import("@/models/Menu");
      const { Setting } = await import("@/models/Setting");
      const { CmsSection } = await import("@/models/CmsSection");

      const mainHeader = new Menu({
        name: "Main Header",
        links: [
          { label: "Home", url: "/", order: 1, isActive: true },
          { label: "Products", url: "/products", order: 2, isActive: true },
          { label: "About", url: "/about", order: 3, isActive: true },
          { label: "Contact", url: "/contact", order: 4, isActive: true },
        ]
      });

      const footerQuick = new Menu({
        name: "Footer Quick Links",
        links: [
          { label: "About Us", url: "/about", order: 1, isActive: true },
          { label: "Products", url: "/products", order: 2, isActive: true },
          { label: "Contact Us", url: "/contact", order: 3, isActive: true },
        ]
      });

      const footerPolicy = new Menu({
        name: "Footer Policy Links",
        links: [
          { label: "Privacy Policy", url: "/privacy-policy", order: 1, isActive: true },
          { label: "Terms & Conditions", url: "/terms-conditions", order: 2, isActive: true },
        ]
      });

      await Menu.insertMany([mainHeader, footerQuick, footerPolicy]);

      const globalSetting = new Setting({
        storeName: "Forever Healthcare",
        storeEmail: "support@foreverhealthcare.in",
        storePhone: "+91 123 456 7890",
        address: "Mumbai, Maharashtra, India",
        currency: "INR",
        footerAboutText: "India's trusted premium brand providing 100% organic wellness, supplements, and healthcare essentials.",
        footerQuickLinks: footerQuick._id,
        footerPolicyLinks: footerPolicy._id,
        socialLinks: { facebook: "#", instagram: "#", twitter: "#" }
      });
      await globalSetting.save();

      const heroSection = new CmsSection({
        title: "Hero",
        type: "HERO",
        order: 1,
        isEnabled: true,
        slides: [{ image: "/banners/hero.jpg", title: "Welcome to Forever Healthcare" }]
      });
      const featureSection = new CmsSection({
        title: "Featured Products",
        type: "PRODUCTGRID",
        order: 2,
        isEnabled: true,
        limit: 8
      });
      await CmsSection.insertMany([heroSection, featureSection]);

    } catch (e) {
      console.log("Failed to seed CMS models", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database completely cleared and seeded successfully with CMS models, products, categories, and other entities." 
    });
    
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
