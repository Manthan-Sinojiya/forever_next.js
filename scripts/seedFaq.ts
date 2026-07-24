import mongoose from "mongoose";
import dotenv from "dotenv";
import { Faq } from "../models/Faq";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI as string)
  .then(async () => {
    // 5. Seed FAQ
    try {
      await Faq.deleteMany({});
      const faq1 = new Faq({
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days across India. Express shipping is typically delivered within 24-48 hours in metro cities.",
        category: "shipping"
      });
      const faq2 = new Faq({
        question: "Are your Ayurvedic products certified?",
        answer: "Yes, absolutely! All our herbal extracts and ayurvedic products are sourced from GMP-certified facilities and rigorously lab-tested for purity.",
        category: "product"
      });
      const faq3 = new Faq({
        question: "What is your return policy?",
        answer: "We offer a 7-day replacement guarantee if the items delivered were defective or didn't match the order.",
        category: "returns"
      });
      await Faq.insertMany([faq1, faq2, faq3]);
      console.log("FAQS seeded successfully.");
    } catch (e: any) { console.error("FAQ seed failed: ", e.message); }

    process.exit(0);
  });
