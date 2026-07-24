import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPageBySlug } from "@/actions/customPages";
import { getActiveBannerByPosition } from "@/actions/admin/banners";
import AboutClient from "./AboutClient";
import PageBanner from "@/components/ui/PageBanner";

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const bannerRes = await getActiveBannerByPosition("about-us");
  const banner = bannerRes?.data;

  if (page) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-[#F8FAFC] py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBanner
              banner={banner}
              defaultTitle={page.title || "About Forever Healthcare"}
              defaultSubtitle="Bridging Ayurveda & Modern Science for holistic health and wellness."
              badge="About Us"
            />
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mt-8">
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-800 mb-6">{page.title}</h1>
              <div 
                className="prose prose-emerald max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fallback to static UI with dynamic banner support
  return <AboutClient banner={banner} />;
}
