import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // Ensure categories exist
    let categories: any[] = await Category.find({}).lean();
    if (categories.length === 0) {
      const categoryData = [
        { name: "Food Supplements", slug: "food-supplements", description: "Dietary supplements for optimal health", status: "active", image: "/categories/food-supplements.png" },
        { name: "Healthcare Equipments", slug: "healthcare-equipments", description: "Medical devices and equipment", status: "active", image: "/categories/healthcare.png" },
        { name: "Men Health", slug: "men-health", description: "Products tailored for men's health", status: "active", image: "/categories/men-health.png" },
        { name: "Personal Care", slug: "personal-care", description: "Hygiene and personal care items", status: "active", image: "/categories/personal-care.png" }
      ];
      categories = await Category.insertMany(categoryData);
    }

    const fs = (categories.find((c: any) => c.slug === "food-supplements") || categories[0])._id;
    const he = (categories.find((c: any) => c.slug === "healthcare-equipments") || categories[1] || categories[0])._id;
    const mh = (categories.find((c: any) => c.slug === "men-health") || categories[2] || categories[0])._id;
    const pc = (categories.find((c: any) => c.slug === "personal-care") || categories[3] || categories[0])._id;

    // Delete existing products (to avoid duplicates)
    await Product.deleteMany({});

    const products = [
      {
        name: "Forever Pure Ashwagandha 500mg | Stress & Vitality",
        slug: "forever-pure-ashwagandha-500mg-stress-vitality",
        category: fs, mrp: 799, price: 499, inventory: 200,
        inStock: true, isFeatured: true, isBestSeller: true, todayDeal: true, status: "active",
        thumbnail: "/products/ashwagandha.png",
        images: [{ url: "/products/ashwagandha.png", alt: "Ashwagandha" }],
        shortDescription: "India's most trusted Ashwagandha with 5% Withanolides for stress relief and vitality.",
        description: "<p>Forever Pure <strong>Ashwagandha 500mg</strong> provides potent stress-relief and vitality boost with 5% Withanolides. KSM-66 certified extract for maximum bioavailability.</p>",
        ingredients: "Organic Ashwagandha Root Extract (5% Withanolides, KSM-66)",
        benefits: "Reduces cortisol, boosts testosterone, improves sleep quality",
        howToUse: "1 capsule twice a day with warm milk or water",
        variants: [
          { attribute: "Size", value: "30 Capsules", price: 349, inventory: 100, sku: "FHC-ASH-30C" },
          { attribute: "Size", value: "60 Capsules", price: 499, inventory: 150, sku: "FHC-ASH-60C" },
          { attribute: "Size", value: "120 Capsules", price: 849, inventory: 80, sku: "FHC-ASH-120C" },
        ],
        metaTitle: "Buy Ashwagandha 500mg - Forever Healthcare",
        metaDescription: "Premium Ashwagandha 500mg with 5% Withanolides. Stress relief, vitality boost. 30/60/120 caps.",
        metaKeywords: "ashwagandha, stress relief, adaptogen, ksm-66"
      },
      {
        name: "Forever Fit Liver | Natural Liver Detox Supplement",
        slug: "forever-fit-liver-natural-detox-supplement",
        category: fs, mrp: 899, price: 599, inventory: 150,
        inStock: true, isFeatured: true, isBestSeller: true, status: "active",
        thumbnail: "/products/vitality-capsules.png",
        images: [{ url: "/products/vitality-capsules.png", alt: "Liver Detox" }],
        shortDescription: "Powerful liver detox with Milk Thistle and Kutki for optimal liver health.",
        description: "<p>Forever Fit Liver supports complete liver detox and regeneration using clinically proven Milk Thistle, Kutki, and Bhumi Amla formulation.</p>",
        ingredients: "Milk Thistle (80% Silymarin), Kutki, Bhumi Amla, Punarnava, Kalmegh",
        benefits: "Liver detoxification, improved digestion, toxin removal, enzyme normalization",
        howToUse: "2 tablets twice daily after meals",
        variants: [
          { attribute: "Size", value: "60 Tablets", price: 499, inventory: 80, sku: "FHC-LVR-60T" },
          { attribute: "Size", value: "120 Tablets", price: 849, inventory: 60, sku: "FHC-LVR-120T" },
          { attribute: "Size", value: "180 Tablets", price: 1199, inventory: 40, sku: "FHC-LVR-180T" },
        ],
        metaTitle: "Forever Fit Liver – Natural Liver Detox Tablets",
        metaDescription: "Natural liver detox with Milk Thistle and Kutki. Available in 60/120/180 tablets.",
        metaKeywords: "liver detox, milk thistle, liver health, kutki"
      },
      {
        name: "Forever Let It Melt | Herbal Weight Management",
        slug: "forever-let-it-melt-herbal-weight-management",
        category: fs, mrp: 1199, price: 699, inventory: 120,
        inStock: true, isFeatured: true, todayDeal: true, status: "active",
        thumbnail: "/products/vitality-capsules-alt.png",
        images: [{ url: "/products/vitality-capsules-alt.png", alt: "Weight Management" }],
        shortDescription: "Ayurvedic blend of Green Coffee, Garcinia & Triphala for healthy weight management.",
        description: "<p>Forever Let It Melt is a powerful thermogenic formula for natural weight loss, combining proven Ayurvedic and modern nutritional science.</p>",
        ingredients: "Green Coffee Bean Extract (50% CGA), Garcinia Cambogia (60% HCA), Triphala, Guggul, Black Pepper (Bioperine)",
        benefits: "Boosts metabolism, suppresses appetite, burns stored fat, controls cravings",
        howToUse: "1 capsule 30 minutes before meals, twice daily with lukewarm water",
        variants: [
          { attribute: "Size", value: "60 Capsules", price: 599, inventory: 70, sku: "FHC-LIM-60C" },
          { attribute: "Size", value: "120 Capsules", price: 999, inventory: 50, sku: "FHC-LIM-120C" },
        ],
        metaTitle: "Forever Let It Melt – Herbal Weight Loss Capsules",
        metaDescription: "Ayurvedic weight management with Green Coffee and Garcinia Cambogia. 60/120 capsule packs.",
        metaKeywords: "weight loss, garcinia, green coffee, slim, fat burner"
      },
      {
        name: "Forever Vita 365 | Multivitamin & Probiotics",
        slug: "forever-vita-365-multivitamin-probiotics",
        category: fs, mrp: 799, price: 549, inventory: 180,
        inStock: true, isFeatured: true, isBestSeller: true, status: "active",
        thumbnail: "/products/vitamin-c-zinc.png",
        images: [{ url: "/products/vitamin-c-zinc.png", alt: "Multivitamin" }],
        shortDescription: "365-day complete nutrition with 24 vitamins, minerals and 5 billion CFU probiotics.",
        description: "<p>Forever Vita 365 provides complete daily nutrition coverage with 24 vitamins, essential minerals, and beneficial bacteria for gut and immune health.</p>",
        ingredients: "Vitamin A, C, D3, E, K2, B-complex, Zinc, Iron, Selenium, Probiotics (Lactobacillus acidophilus 5 billion CFU)",
        benefits: "Boosts immunity, improves energy, supports gut health, reduces fatigue",
        howToUse: "1 tablet daily after breakfast",
        variants: [
          { attribute: "Size", value: "30 Tablets", price: 299, inventory: 100, sku: "FHC-V365-30T" },
          { attribute: "Size", value: "60 Tablets", price: 499, inventory: 120, sku: "FHC-V365-60T" },
          { attribute: "Size", value: "90 Tablets", price: 699, inventory: 80, sku: "FHC-V365-90T" },
        ],
        metaTitle: "Forever Vita 365 – Complete Multivitamin with Probiotics",
        metaDescription: "Complete daily multivitamin with 24 nutrients and 5 billion CFU probiotics. 30/60/90 tablets.",
        metaKeywords: "multivitamin, probiotics, daily vitamin, immunity, minerals"
      },
      {
        name: "Forever Shilajit Gold Resin | 100% Pure Himalayan",
        slug: "forever-shilajit-gold-resin-pure-himalayan",
        category: mh, mrp: 1999, price: 999, inventory: 80,
        inStock: true, isFeatured: true, isBestSeller: true, status: "active",
        thumbnail: "/products/personal-care-alt.png",
        images: [{ url: "/products/personal-care-alt.png", alt: "Shilajit" }],
        shortDescription: "100% pure Himalayan Shilajit resin with 85+ minerals and 60%+ fulvic acid.",
        description: "<p>Authentic Himalayan Shilajit resin sourced from altitudes above 16,000ft for peak male performance, energy improvement, and mineral supplementation.</p>",
        ingredients: "Pure Shilajit Resin (85+ Minerals, Fulvic Acid 60%+, Iron, Calcium, Copper, Magnesium)",
        benefits: "Boosts testosterone, improves energy levels, enhances athletic recovery, supports brain function",
        howToUse: "Dissolve pea-sized amount (300mg) in warm milk or water, twice daily",
        variants: [
          { attribute: "Size", value: "20g Resin", price: 699, inventory: 60, sku: "FHC-SHI-20G" },
          { attribute: "Size", value: "40g Resin", price: 999, inventory: 40, sku: "FHC-SHI-40G" },
          { attribute: "Size", value: "80g Resin", price: 1799, inventory: 25, sku: "FHC-SHI-80G" },
        ],
        metaTitle: "Forever Shilajit Gold – Pure Himalayan Resin",
        metaDescription: "100% pure Himalayan Shilajit with 85+ minerals and 60% fulvic acid. 20g/40g/80g packs.",
        metaKeywords: "shilajit, shilajit gold, testosterone, men health, fulvic acid"
      },
      {
        name: "Forever Let It Glow | Marine Collagen Beauty Powder",
        slug: "forever-let-it-glow-collagen-beauty-powder",
        category: pc, mrp: 1199, price: 799, inventory: 100,
        inStock: true, isFeatured: true, status: "active",
        thumbnail: "/products/personal-care.png",
        images: [{ url: "/products/personal-care.png", alt: "Collagen Glow" }],
        shortDescription: "Marine Collagen with Vitamin C and Hyaluronic Acid for radiant skin and hair.",
        description: "<p>Forever Let It Glow provides a complete beauty supplement with Marine Collagen (Type 1 & 3) for youthful skin, strong hair, and flexible joints.</p>",
        ingredients: "Marine Collagen Peptides (Type 1 & 3), Vitamin C (100mg), Hyaluronic Acid, Biotin, Vitamin E",
        benefits: "Reduces wrinkles, improves skin elasticity, strengthens hair and nails, supports joint health",
        howToUse: "Mix 1 scoop in cold water, juice, or smoothie daily, morning or evening",
        variants: [
          { attribute: "Size", value: "150g Powder", price: 799, inventory: 60, sku: "FHC-GLW-150G" },
          { attribute: "Size", value: "300g Powder", price: 1399, inventory: 40, sku: "FHC-GLW-300G" },
        ],
        metaTitle: "Forever Let It Glow – Marine Collagen Beauty Powder",
        metaDescription: "Marine collagen with Vitamin C and Hyaluronic Acid for glowing skin. 150g/300g powder packs.",
        metaKeywords: "collagen, glow, skin, beauty, hyaluronic acid, biotin"
      },
      {
        name: "Forever Aloe Vera Juice | 100% AAA Grade Pure",
        slug: "forever-aloe-vera-juice-aaa-grade-pure",
        category: fs, mrp: 799, price: 499, inventory: 120,
        inStock: true, isBestSeller: true, status: "active",
        thumbnail: "/products/vitamin-c-zinc.png",
        images: [{ url: "/products/vitamin-c-zinc.png", alt: "Aloe Vera Juice" }],
        shortDescription: "100% AAA grade Aloe Vera inner gel juice with no artificial preservatives.",
        description: "<p>Pure Aloe Vera juice extracted from AAA grade inner gel for digestive health, skin glow, and immunity support. No added sugar or artificial preservatives.</p>",
        ingredients: "Pure Aloe Vera Inner Gel (99.9%), Vitamin C (natural preservative, 50mg)",
        benefits: "Improves digestion, boosts immunity, hydrates skin from within, alkalizes body",
        howToUse: "30ml diluted in a glass of water, twice daily on empty stomach",
        variants: [
          { attribute: "Size", value: "500ml Juice", price: 299, inventory: 80, sku: "FHC-ALO-500ML" },
          { attribute: "Size", value: "1L Juice", price: 499, inventory: 60, sku: "FHC-ALO-1L" },
          { attribute: "Size", value: "2L Juice", price: 849, inventory: 40, sku: "FHC-ALO-2L" },
        ],
        metaTitle: "Forever Aloe Vera Juice – 100% Pure AAA Grade",
        metaDescription: "Pure AAA grade Aloe Vera juice for digestion, immunity and skin. 500ml, 1L and 2L sizes.",
        metaKeywords: "aloe vera juice, pure aloe, digestion, immunity, skin"
      },
      {
        name: "Digital Blood Pressure Monitor | Smart BP Machine",
        slug: "digital-blood-pressure-monitor-smart",
        category: he, mrp: 2499, price: 1499, inventory: 50,
        inStock: true, isFeatured: true, status: "active",
        thumbnail: "/products/bp-monitor.png",
        images: [{ url: "/products/bp-monitor.png", alt: "BP Monitor" }],
        shortDescription: "Clinically validated BP monitor with WHO classification and arrhythmia detection.",
        description: "<p>Smart digital BP monitor with WHO blood pressure classification indicator, arrhythmia detection, and 2x60 reading memory for two users.</p>",
        ingredients: "N/A - Medical Device",
        benefits: "Accurate blood pressure measurement, home health monitoring, doctor-recommended",
        howToUse: "Sit comfortably, wrap cuff on left upper arm at heart level, press Start button",
        variants: [],
        metaTitle: "Digital BP Monitor – Smart Blood Pressure Machine",
        metaDescription: "WHO classified digital BP monitor with arrhythmia detection and 60-reading memory. Clinically validated.",
        metaKeywords: "bp monitor, blood pressure, digital, hypertension, home monitoring"
      },
      {
        name: "Fingertip Pulse Oximeter | SpO2 & Heart Rate Monitor",
        slug: "fingertip-pulse-oximeter-spo2-heart-rate",
        category: he, mrp: 1199, price: 699, inventory: 75,
        inStock: true, isBestSeller: true, todayDeal: true, status: "active",
        thumbnail: "/products/pulse-oximeter.png",
        images: [{ url: "/products/pulse-oximeter.png", alt: "Pulse Oximeter" }],
        shortDescription: "Instant SpO2 and heart rate reading with large 4-direction OLED display.",
        description: "<p>Medical-grade fingertip pulse oximeter for home use with auto-off power saving and 4-direction rotating OLED display for easy reading.</p>",
        ingredients: "N/A - Medical Device",
        benefits: "Instantly measure oxygen saturation (SpO2) and heart rate, COVID safety monitoring",
        howToUse: "Place index finger in device. Wait 10 seconds for stable reading on OLED display",
        variants: [],
        metaTitle: "Pulse Oximeter – SpO2 & Heart Rate Monitor",
        metaDescription: "Medical-grade pulse oximeter for SpO2 and heart rate. 4-direction OLED display, auto-off.",
        metaKeywords: "pulse oximeter, spo2, oxygen saturation, heart rate, covid"
      },
      {
        name: "Smart Glucometer | Blood Glucose Meter Kit",
        slug: "smart-glucometer-blood-glucose-meter-kit",
        category: he, mrp: 1599, price: 999, inventory: 60,
        inStock: true, status: "active",
        thumbnail: "/products/glucose-meter.png",
        images: [{ url: "/products/glucose-meter.png", alt: "Glucose Meter" }],
        shortDescription: "5-second blood glucose reading with 300-reading memory and smart app connectivity.",
        description: "<p>Smart glucometer kit includes meter, 25 test strips and lancets for easy home diabetes management. Connects to app for trend tracking.</p>",
        ingredients: "N/A - Medical Device",
        benefits: "Monitor blood glucose, track diabetes management, doctor-friendly reports",
        howToUse: "Insert test strip, prick fingertip, apply blood drop to strip. Read result in 5 seconds",
        variants: [
          { attribute: "Pack", value: "Starter Kit (25 Strips)", price: 999, inventory: 40, sku: "FHC-GLU-STR" },
          { attribute: "Pack", value: "Refill: 50 Test Strips", price: 499, inventory: 60, sku: "FHC-GLU-50S" },
          { attribute: "Pack", value: "Refill: 100 Test Strips", price: 899, inventory: 30, sku: "FHC-GLU-100S" },
        ],
        metaTitle: "Smart Glucometer – Blood Glucose Meter Kit",
        metaDescription: "5-second glucometer with 300-memory and app connectivity. Starter kit and strip refills.",
        metaKeywords: "glucometer, glucose meter, diabetes, blood sugar, diabetic"
      },
      {
        name: "Forever MenX | Ayurvedic Testosterone Booster",
        slug: "forever-menx-ayurvedic-testosterone-booster",
        category: mh, mrp: 1199, price: 799, inventory: 100,
        inStock: true, isFeatured: true, isBestSeller: true, status: "active",
        thumbnail: "/products/personal-care-alt.png",
        images: [{ url: "/products/personal-care-alt.png", alt: "Men Vitality" }],
        shortDescription: "Ayurvedic testosterone booster with Safed Musli, Kaunch Beej and Ashwagandha.",
        description: "<p>Forever MenX is a potent blend of Ayurvedic herbs formulated for peak male performance, energy, and vitality.</p>",
        ingredients: "Safed Musli (15%), Kaunch Beej (15%), Ashwagandha (10%), Shatavari (10%), Gokhru (10%), Shilajit Extract, Zinc, Vitamin D3",
        benefits: "Boosts testosterone naturally, improves energy and stamina, enhances libido and performance",
        howToUse: "2 capsules daily with warm milk, morning and evening, for at least 3 months",
        variants: [
          { attribute: "Size", value: "30 Capsules", price: 499, inventory: 60, sku: "FHC-MNX-30C" },
          { attribute: "Size", value: "60 Capsules", price: 799, inventory: 80, sku: "FHC-MNX-60C" },
          { attribute: "Size", value: "90 Capsules", price: 1099, inventory: 50, sku: "FHC-MNX-90C" },
        ],
        metaTitle: "Forever MenX – Ayurvedic Testosterone Booster",
        metaDescription: "Top-selling men's testosterone booster with Safed Musli, Shilajit and Ashwagandha. 30/60/90 caps.",
        metaKeywords: "testosterone booster, men health, safed musli, vitality, kaunch beej"
      },
      {
        name: "Forever Noni Juice | Premium Antioxidant Drink",
        slug: "forever-noni-juice-premium-antioxidant",
        category: fs, mrp: 999, price: 699, inventory: 90,
        inStock: true, status: "active", todayDeal: true,
        thumbnail: "/products/vitamin-c-zinc.png",
        images: [{ url: "/products/vitamin-c-zinc.png", alt: "Noni Juice" }],
        shortDescription: "Premium Morinda Citrifolia Noni juice for antioxidant protection and immune boost.",
        description: "<p>Forever Noni Juice is packed with antioxidants, phytonutrients and 150+ vitamins for complete body wellness and cellular health.</p>",
        ingredients: "Noni Fruit Juice (Morinda Citrifolia 93%), Natural Grape & Blueberry Concentrate",
        benefits: "Antioxidant protection, improved immunity, joint health, improved energy",
        howToUse: "30ml in the morning, dilute with water if needed. Shake well before use",
        variants: [
          { attribute: "Size", value: "500ml Juice", price: 499, inventory: 60, sku: "FHC-NON-500ML" },
          { attribute: "Size", value: "1L Juice", price: 699, inventory: 50, sku: "FHC-NON-1L" },
        ],
        metaTitle: "Forever Noni Juice – Premium Morinda Citrifolia",
        metaDescription: "Premium Noni juice with 150+ vitamins for antioxidant protection and immunity. 500ml and 1L.",
        metaKeywords: "noni juice, antioxidant, immunity, morinda citrifolia, noni"
      },
    ];

    const savedProducts = await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${savedProducts.length} products with proper variants and pricing.`,
      count: savedProducts.length
    });

  } catch (error: any) {
    console.error("Product seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
