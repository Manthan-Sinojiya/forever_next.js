import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Models (mocking the schema to avoid complex imports if needed, but since we are in the project we can just require them or redefine them)
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

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { type: String },
  tags: [String],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  topBannerImage: String,
  bottomBannerImage: String,
  isActive: { type: Boolean, default: true },
});

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
const Page = mongoose.models.Page || mongoose.model("Page", pageSchema);
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/forever-healthcare";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing
    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Blog.deleteMany({});
    await Page.deleteMany({});
    await Setting.deleteMany({});

    // 1. Categories
    const categories = [
      { name: "Supplements", slug: "supplements", isActive: true },
      { name: "Liver Care", slug: "liver-care", isActive: true },
      { name: "Hair Care", slug: "hair-care", isActive: true },
      { name: "Weight Management", slug: "weight-management", isActive: true },
      { name: "Skin Care", slug: "skin-care", isActive: true },
    ];
    await Category.insertMany(categories);
    console.log("Inserted Categories.");

    // 2. Products from Fytika
    console.log("Fetching products from Fytika...");
    const { data } = await axios.get("https://fytika.com/products.json?limit=25");
    const shopifyProducts = data.products;

    const formattedProducts = shopifyProducts.map((p: any, index: number) => {
      const price = parseFloat(p.variants[0]?.price || "499");
      const originalPrice = parseFloat(p.variants[0]?.compare_at_price || String(price * 1.5));
      const imageUrl = p.images && p.images.length > 0 ? p.images[0].src : "https://via.placeholder.com/600";
      
      // Assign random category
      const randomCat = categories[index % categories.length].name;

      return {
        name: p.title.replace(/🎁\s*/g, ""), // clean emojis
        category: randomCat,
        price,
        originalPrice,
        imageUrl,
        description: p.body_html || "<p>Premium Healthcare Supplement.</p>",
        inStock: true,
        featured: index < 4,
        todayDeal: index === 5 || index === 6,
      };
    });

    await Product.insertMany(formattedProducts);
    console.log(`Inserted ${formattedProducts.length} Products from Fytika.`);

    // 3. Blogs
    const blogs = [
      {
        title: "The Ultimate Guide to Liver Detox",
        slug: "ultimate-guide-liver-detox",
        excerpt: "Learn how to naturally detoxify your liver using powerful ayurvedic herbs.",
        content: "<h2>Why Liver Health Matters</h2><p>Your liver is one of the most vital organs in the body...</p>",
        coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
        tags: ["Detox", "Liver", "Ayurveda"],
      },
      {
        title: "5 Tips for Glowing Skin",
        slug: "5-tips-glowing-skin",
        excerpt: "Achieve radiant skin with these simple natural remedies.",
        content: "<h2>Drink More Water</h2><p>Hydration is the key to glowing skin...</p>",
        coverImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
        tags: ["Beauty", "Skin Care"],
      }
    ];
    await Blog.insertMany(blogs);
    console.log("Inserted Blogs.");

    // 4. Pages
    const pages = [
      {
        title: "About Us",
        slug: "about",
        content: "<h2>Who We Are</h2><p>Forever Healthcare is dedicated to providing premium quality health supplements.</p>",
      },
      {
        title: "Refund Policy",
        slug: "refund-policy",
        content: "<h2>Returns and Refunds</h2><p>We offer a 30-day money-back guarantee on all our products.</p>",
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<h2>Your Privacy Matters</h2><p>We do not share your personal data with third parties.</p>",
      }
    ];
    await Page.insertMany(pages);
    console.log("Inserted Pages.");

    // 5. Navigation & Homepage Settings
    const navSettings = [
      {
        key: "navigation",
        value: {
          categoryMenuLabel: "Shop by Category",
          dropdownSubItems: { medicine: true, equipment: true },
          headerItems: [
            { id: "1", title: "Home", targetUrl: "/" },
            { id: "2", title: "Products", targetUrl: "/products" },
            { id: "3", title: "Blogs", targetUrl: "/blog" },
            { id: "4", title: "About", targetUrl: "/pages/about" }
          ],
          showMegamenu: true,
          megamenuColumns: [
            { id: "c1", title: "Supplements", links: "Liver Care, Hair Care" },
            { id: "c2", title: "Personal Care", links: "Skin Care, Grooming" }
          ],
          megamenuBanners: [
            { id: "b1", heading: "New Arrivals", link: "/products", imageUrl: "" }
          ],
          footerColumns: [
            { id: "f1", title: "Quick Links", links: "Home|/,Products|/products,Blogs|/blog" },
            { id: "f2", title: "Policies", links: "Privacy|/pages/privacy-policy,Refunds|/pages/refund-policy" }
          ]
        }
      },
      {
        key: "homepage_standards_title",
        value: "Why Choose Forever Healthcare"
      },
      {
        key: "homepage_standards_content",
        value: "<ul><li>100% Natural Ingredients</li><li>Lab Tested for Purity</li><li>GMP Certified Manufacturing</li></ul>"
      }
    ];
    await Setting.insertMany(navSettings);
    console.log("Inserted Navigation & Homepage CMS Settings.");

    console.log("Seed successful!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
