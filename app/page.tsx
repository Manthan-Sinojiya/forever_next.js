import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import DealsAndCoupons from "@/components/home/DealsAndCoupons";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import Blog from "@/components/home/Blog";
import About from "@/components/home/About";
import TrustBadges from "@/components/home/TrustBadges";
import DynamicSections from "@/components/home/DynamicSections";

import connectDB from "@/lib/mongodb";
import { CmsSection } from "@/models/CmsSection";

export default async function Home() {
  await connectDB();
  const cmsSections = await CmsSection.find({ isEnabled: true }).sort({ order: 1 }).lean();

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {cmsSections.length > 0 ? (
          cmsSections.map((section: any) => {
            switch (section.type) {
              case "HERO":
                return <Hero key={section._id.toString()} slides={section.slides} />;
              case "OFFERBANNER":
                return <DealsAndCoupons key={section._id.toString()} />;
              case "TRUSTBADGES":
                return <TrustBadges key={section._id.toString()} title={section.title} description={section.description} />;
              case "PRODUCTGRID":
                return <FeaturedProducts key={section._id.toString()} title={section.title} limit={section.limit} />;
              case "RICHCONTENT":
                return <About key={section._id.toString()} title={section.title} description={section.description} />;
              case "CATEGORYGRID":
                return <Categories key={section._id.toString()} title={section.title} limit={section.limit} />;
              case "BLOGGRID":
                return <Blog key={section._id.toString()} title={section.title} />;
              case "TESTIMONIALS":
                return <Testimonials key={section._id.toString()} />;
              default:
                return null;
            }
          })
        ) : (
          <>
            <Hero />
            <DealsAndCoupons />
            <TrustBadges />
            <FeaturedProducts />
            <About />
            <Categories />
            <Blog />
            <Testimonials />
          </>
        )}

        <DynamicSections />
      </main>
      <Footer />
    </>
  );
}

