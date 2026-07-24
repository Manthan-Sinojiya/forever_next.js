import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import { getActiveBannerByPosition } from "@/actions/admin/banners";

export const metadata: Metadata = {
  title: "All Categories | Forever Healthcare",
  description: "Explore all healthcare, Ayurveda, nutrition, and wellness product categories.",
};

const CATEGORIES = [
  { slug: "nutrition", name: "Nutrition", icon: "🌿", description: "Vitamins, minerals & health supplements", count: "150+", gradient: "from-emerald-400 to-teal-500" },
  { slug: "healthcare-equipment", name: "Healthcare Equipment", icon: "🏥", description: "BP monitors, glucometers & diagnostics", count: "80+", gradient: "from-blue-400 to-indigo-500" },
  { slug: "personal-care", name: "Personal Care", icon: "✨", description: "Natural skincare & hygiene products", count: "120+", gradient: "from-pink-400 to-rose-500" },
  { slug: "ayurveda", name: "Ayurveda", icon: "🌱", description: "Authentic Ayurvedic herbs & formulations", count: "200+", gradient: "from-lime-500 to-emerald-600" },
  { slug: "immunity", name: "Immunity", icon: "🛡️", description: "Immunity boosters & adaptogens", count: "60+", gradient: "from-violet-400 to-purple-500" },
  { slug: "diabetes-care", name: "Diabetes Care", icon: "💉", description: "Blood sugar management solutions", count: "45+", gradient: "from-orange-400 to-red-500" },
  { slug: "heart-care", name: "Heart Care", icon: "❤️", description: "Cardiovascular health supplements", count: "35+", gradient: "from-red-400 to-pink-500" },
  { slug: "skin-care", name: "Skin Care", icon: "🌸", description: "Ayurvedic & natural skincare", count: "90+", gradient: "from-rose-400 to-pink-400" },
  { slug: "hair-care", name: "Hair Care", icon: "💆", description: "Hair growth & nourishment products", count: "50+", gradient: "from-amber-400 to-orange-500" },
  { slug: "weight-management", name: "Weight Management", icon: "⚖️", description: "Fat burners, detox & meal plans", count: "70+", gradient: "from-cyan-400 to-blue-500" },
];

export default async function CategoriesPage() {
  const bannerRes = await getActiveBannerByPosition("categories-overview");
  const banner = bannerRes?.data;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container mx-auto px-4 pt-6">
          <PageBanner
            banner={banner}
            defaultTitle="Shop by Category"
            defaultSubtitle="Discover products across 10+ healthcare & wellness categories"
            badge="Categories"
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-br ${cat.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-5xl opacity-40 absolute right-4 top-2 select-none">{cat.icon}</span>
                  <span className="text-4xl relative z-10">{cat.icon}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold font-heading text-slate-800 text-base sm:text-lg mb-1 group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 leading-relaxed">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {cat.count} Products
                    </span>
                    <span className="text-emerald-600 text-xs font-bold group-hover:translate-x-1 transition-transform inline-block">
                      Shop →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* SEO Section */}
          <div className="mt-14 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-slate-800 text-xl mb-4">Premium Healthcare Categories</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-4xl">
              Forever Healthcare offers a comprehensive range of wellness products across nutrition, Ayurveda, healthcare equipment, personal care, and specialized health categories. 
              All products are sourced from certified manufacturers, clinically tested, and curated by healthcare professionals for optimal results.
              Explore our extensive catalog to find exactly what you need for your health and wellness journey.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
