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
import { Blog as BlogModel } from "@/models/Blog";
import { Testimonial as TestimonialModel } from "@/models/Testimonial";

export default async function Home() {
  await connectDB();
  const cmsSections = await CmsSection.find({ isEnabled: true }).sort({ order: 1 }).lean();

  const blogs = await BlogModel.find({ status: "published" }).sort({ createdAt: -1 }).limit(3).lean();
  const serializedBlogs = JSON.parse(JSON.stringify(blogs));

  const testimonialsData = await TestimonialModel.find({ status: "active" }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  const serializedTestimonials = JSON.parse(JSON.stringify(testimonialsData));

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
                return <DealsAndCoupons key={section._id.toString()} title={section.title} subtitle={section.subtitle} endDate={section.description} />;
              case "TRUSTBADGES":
                return <TrustBadges key={section._id.toString()} title={section.title} description={section.description} subtitle={section.subtitle} slides={section.slides} />;
              case "PRODUCTGRID":
                return <FeaturedProducts key={section._id.toString()} title={section.title} limit={section.limit} subtitle={section.subtitle} description={section.description} />;
              case "RICHCONTENT":
                return <About key={section._id.toString()} title={section.title} description={section.description} image={section.content?.image} />;
              case "CATEGORYGRID":
                return <Categories key={section._id.toString()} title={section.title} limit={section.limit} subtitle={section.subtitle} description={section.description} />;
              case "BLOGGRID":
                return <Blog key={section._id.toString()} title={section.title} blogData={serializedBlogs} subtitle={section.subtitle} description={section.description} />;
              case "TESTIMONIALS":
                return <Testimonials key={section._id.toString()} testimonialsData={serializedTestimonials} />;
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
            <Blog blogData={serializedBlogs} />
            <Testimonials testimonialsData={serializedTestimonials} />
          </>
        )}

        <DynamicSections />
      </main>
      <Footer />
    </>
  );
}

