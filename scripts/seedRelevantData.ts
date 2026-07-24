import mongoose from "mongoose";
import dotenv from "dotenv";
import { Menu } from "../models/Menu";
import { Setting } from "../models/Setting";
import { CustomPage } from "../models/CustomPage";
import { Testimonial } from "../models/Testimonial";
import { Faq } from "../models/Faq";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI as string)
  .then(async () => {
    console.log("Connected to MongoDB for UI Config Seeding.");

    // 1. Seed Menus
    try {
      await Menu.deleteMany({});
      
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
          { label: "Blog", url: "/blog", order: 4, isActive: true },
        ]
      });

      const footerPolicy = new Menu({
        name: "Footer Policy Links",
        links: [
          { label: "Privacy Policy", url: "/privacy-policy", order: 1, isActive: true },
          { label: "Terms & Conditions", url: "/terms-conditions", order: 2, isActive: true },
          { label: "Refund Policy", url: "/refund-policy", order: 3, isActive: true },
        ]
      });

      await Menu.insertMany([mainHeader, footerQuick, footerPolicy]);
      console.log("Menus seeded successfully.");
    } catch (e: any) { console.error("Menu seed failed: ", e.message); }

    // 2. Seed Settings
    try {
      await Setting.deleteMany({});
      const globalSetting = new Setting({
        storeName: "Forever Healthcare",
        storeEmail: "support@foreverhealthcare.in",
        storePhone: "+91 123 456 7890",
        address: "Mumbai, Maharashtra, India",
        currency: "INR",
        footerAboutText: "India's trusted premium brand providing 100% organic wellness, supplements, and healthcare essentials.",
        socialLinks: { facebook: "#", instagram: "#", twitter: "#" },
        announcement: "🎉 Free shipping on all orders above ₹499! Use code: EXTRA10 for 10% off",
        announcement_bg: "#0a8c6e",
        announcement_style: "scrolling"
      });
      await globalSetting.save();
      console.log("Settings seeded successfully.");
    } catch (e: any) { console.error("Settings seed failed: ", e.message); }

    // 3. Seed Custom Pages
    try {
      await CustomPage.deleteMany({});
      const customPage1 = new CustomPage({
        title: "About Us",
        slug: "about",
        content: "<p>Welcome to Forever Healthcare! We are dedicated to providing the best Ayurvedic and medical products. Our mission is to integrate holistic well-being with robust modern logistics to serve thousands of families across India.</p>",
        status: "published"
      });
      const customPage2 = new CustomPage({
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<p>Your privacy is important to us. We securely store and manage your data with highly reliable servers. We never sell your personal contact information to third parties.</p>",
        status: "published"
      });
      const customPage3 = new CustomPage({
        title: "Refund Policy",
        slug: "refund-policy",
        content: "<p>We offer a 7-day hassle free replacement policy if the products are found defective or incorrect. Please reach out to our support channel for instant ticketing.</p>",
        status: "published"
      });
      const customPage4 = new CustomPage({
        title: "Terms & Conditions",
        slug: "terms-conditions",
        content: "<p>By browsing this website, you agree to comply with our Terms of Service. These apply to all users without discrimination.</p>",
        status: "published"
      });
      await CustomPage.insertMany([customPage1, customPage2, customPage3, customPage4]);
      console.log("Custom Pages seeded successfully.");
    } catch (e: any) { console.error("Custom Pages seed failed: ", e.message); }

    // 4. Seed Testimonials
    try {
      await Testimonial.deleteMany({});
      const t1 = new Testimonial({
        customerName: "Sarah Connor",
        rating: 5,
        review: "The BP monitor is very accurate and easy to use. Highly recommend Forever Healthcare! Excellent packaging and swift delivery.",
        status: "active",
        isFeatured: true
      });
      const t2 = new Testimonial({
        customerName: "Rahul Sharma",
        rating: 5,
        review: "The Moringa tablets are incredibly effective. Noticed a boost in stamina within just a week of use.",
        status: "active",
        isFeatured: true
      });
      const t3 = new Testimonial({
        customerName: "Priya Desai",
        rating: 4,
        review: "Great customer service. I had a query regarding dosage, and they addressed it instantly on WhatsApp.",
        status: "active",
        isFeatured: true
      });
      await Testimonial.insertMany([t1, t2, t3]);
      console.log("Testimonials seeded successfully.");
    } catch (e: any) { console.error("Testimonials seed failed: ", e.message); }

    // 5. Seed FAQ
    try {
      await Faq.deleteMany({});
      const faq1 = new Faq({
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days across India. Express shipping is typically delivered within 24-48 hours in metro cities.",
        status: "active",
        category: "shipping"
      });
      const faq2 = new Faq({
        question: "Are your Ayurvedic products certified?",
        answer: "Yes, absolutely! All our herbal extracts and ayurvedic products are sourced from GMP-certified facilities and rigorously lab-tested for purity.",
        status: "active",
        category: "product"
      });
      const faq3 = new Faq({
        question: "What is your return policy?",
        answer: "We offer a 7-day replacement guarantee if the items delivered were defective or didn't match the order.",
        status: "active",
        category: "returns"
      });
      await Faq.insertMany([faq1, faq2, faq3]);
      console.log("FAQS seeded successfully.");
    } catch (e: any) { console.error("FAQ seed failed: ", e.message); }

    process.exit(0);
  });
