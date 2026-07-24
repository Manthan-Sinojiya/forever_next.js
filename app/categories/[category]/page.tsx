import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/services/productService";
import PageBanner from "@/components/ui/PageBanner";
import { getActiveBannerByPosition } from "@/actions/admin/banners";


const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  banner: string;
  gradient: string;
  icon: string;
  seoContent: string;
}> = {
  nutrition: {
    title: "Nutrition Supplements",
    description: "Premium vitamins, minerals, protein supplements & health boosters for complete nutrition.",
    banner: "🌿",
    gradient: "from-emerald-600 to-teal-500",
    icon: "🌿",
    seoContent: "Our nutrition range includes scientifically formulated supplements to support energy, immunity, and overall health.",
  },
  "healthcare equipment": {
    title: "Healthcare Equipment",
    description: "Clinically certified BP monitors, glucometers, pulse oximeters & home diagnostic devices.",
    banner: "🏥",
    gradient: "from-blue-600 to-indigo-600",
    icon: "🏥",
    seoContent: "Shop certified medical equipment for home health monitoring including blood pressure monitors, glucometers, and more.",
  },
  "personal care": {
    title: "Personal Care",
    description: "Natural & dermatologist-approved personal care products for your daily wellness routine.",
    banner: "✨",
    gradient: "from-pink-500 to-rose-500",
    icon: "✨",
    seoContent: "Explore our natural personal care range crafted with Ayurvedic ingredients for healthy skin, hair, and body.",
  },
  ayurveda: {
    title: "Ayurveda",
    description: "Authentic Ayurvedic formulations rooted in 5000 years of traditional Indian medicine.",
    banner: "🌱",
    gradient: "from-lime-600 to-emerald-600",
    icon: "🌱",
    seoContent: "Discover our wide range of authentic Ayurvedic herbs, supplements, and formulations backed by traditional wisdom.",
  },
  immunity: {
    title: "Immunity Boosters",
    description: "Strengthen your immune system with our scientifically formulated immunity supplements.",
    banner: "🛡️",
    gradient: "from-violet-600 to-purple-600",
    icon: "🛡️",
    seoContent: "Boost your immunity with Vitamin C, Zinc, Elderberry, and Ayurvedic adaptogens for year-round protection.",
  },
  "diabetes care": {
    title: "Diabetes Care",
    description: "Complete diabetes management solutions including testing kits, supplements & herbal support.",
    banner: "💉",
    gradient: "from-orange-500 to-red-500",
    icon: "💉",
    seoContent: "Manage diabetes effectively with our range of glucometers, test strips, karela jamun, and blood sugar support supplements.",
  },
  "heart care": {
    title: "Heart Care",
    description: "Heart health supplements and monitoring devices to keep your cardiovascular system strong.",
    banner: "❤️",
    gradient: "from-red-500 to-pink-500",
    icon: "❤️",
    seoContent: "Support your heart health with Arjuna extract, Omega-3, CoQ10, and certified BP monitoring equipment.",
  },
  "skin care": {
    title: "Skin Care",
    description: "Ayurvedic and natural skincare products for radiant, healthy skin at every age.",
    banner: "🌸",
    gradient: "from-rose-400 to-pink-400",
    icon: "🌸",
    seoContent: "Our skincare range uses powerful natural ingredients like Neem, Turmeric, and Aloe Vera for glowing, healthy skin.",
  },
  "hair care": {
    title: "Hair Care",
    description: "Strengthen, nourish and grow thicker hair with our Ayurvedic hair care solutions.",
    banner: "💆",
    gradient: "from-amber-500 to-orange-500",
    icon: "💆",
    seoContent: "Discover biotin supplements, Bhringraj oils, and protein-enriched treatments for strong, luscious hair.",
  },
  "weight management": {
    title: "Weight Management",
    description: "Achieve your ideal weight with our clinically tested fat burners, detox teas & meal plans.",
    banner: "⚖️",
    gradient: "from-cyan-600 to-blue-600",
    icon: "⚖️",
    seoContent: "Our weight management range includes green coffee, garcinia cambogia, detox teas, and protein supplements.",
  },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META);

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((cat) => ({ category: cat.replace(/\s+/g, "-") }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const slug = decodeURIComponent(category).toLowerCase().replace(/-/g, " ");
  const meta = CATEGORY_META[slug];
  return {
    title: meta ? `${meta.title} | Forever Healthcare` : "Category | Forever Healthcare",
    description: meta?.description || "Explore our premium healthcare products.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const slug = decodeURIComponent(category).toLowerCase().replace(/-/g, " ");
  const meta = CATEGORY_META[slug] || {
    title: category.replace(/-/g, " "),
    description: "Explore our premium healthcare products.",
    banner: "🌿",
    gradient: "from-emerald-600 to-teal-500",
    icon: "🌿",
    seoContent: "",
  };

  const displayName = meta.title;

  const relatedCategories = ALL_CATEGORIES
    .filter((c) => c !== slug)
    .slice(0, 5)
    .map((c) => ({ slug: c, ...CATEGORY_META[c] }));

  // Fetch all products on server side to pass to client component
  let productsData: any[] = [];
  try {
    const products = await getProducts({ fetchAll: true });
    productsData = products.map(p => {
      const doc = (p as any)._doc || p;
      return {
        _id: doc._id.toString(),
        name: doc.name,
        description: doc.description || doc.shortDescription || "",
        price: doc.price,
        originalPrice: doc.originalPrice || doc.mrp,
        category: doc.category && doc.category.name ? doc.category.name : doc.category,
        imageUrl: doc.images && doc.images.length > 0 ? doc.images[0].url : "/products/missing-image-test.png",
        inStock: doc.inStock !== false,
        featured: doc.isFeatured || doc.isBestSeller || false,
        rating: doc.rating || 5
      };
    });
  } catch (error) {
    console.error("Failed to fetch category products", error);
  }

  const bannerRes = await getActiveBannerByPosition("category-specific", category);
  const banner = bannerRes?.data;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Dynamic Category Banner or Hero Banner */}
        {banner ? (
          <div className="container mx-auto px-4 pt-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-3">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-emerald-600 transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-800 font-semibold">{displayName}</span>
            </nav>
            <PageBanner
              banner={banner}
              defaultTitle={displayName}
              defaultSubtitle={meta.description}
              badge={displayName}
            />
          </div>
        ) : (
          <div className={`bg-gradient-to-r ${meta.gradient} text-white py-14 relative overflow-hidden`}>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[8rem] opacity-10 select-none">{meta.icon}</div>
            <div className="container mx-auto px-4">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-white/70 text-xs font-medium mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white">{displayName}</span>
              </nav>
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">{displayName}</h1>
                <p className="text-white/80 leading-relaxed">{meta.description}</p>
              </div>
            </div>
          </div>
        )}


        {/* SEO Content Strip */}
        {meta.seoContent && (
          <div className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 py-4">
              <p className="text-slate-500 text-sm max-w-3xl">{meta.seoContent}</p>
            </div>
          </div>
        )}

        {/* Related Categories */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <Link href="/shop"
              className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition-all whitespace-nowrap">
              All Products
            </Link>
            {relatedCategories.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug.replace(/\s+/g, "-")}`}
                className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition-all whitespace-nowrap flex items-center gap-1.5">
                <span>{cat.icon}</span>{cat.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          <ProductsGridClient presetCategory={displayName} initialProducts={productsData} />
        </div>
      </main>
      <Footer />
    </>
  );
}
