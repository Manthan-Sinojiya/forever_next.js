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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {/* Banner Hero Carousel */}
        <Hero />

        {/* Deals & Coupon Offers */}
        <DealsAndCoupons />

        {/* Trust Badges (Choose Forever, Choose Health!) */}
        <TrustBadges />

        {/* India's Leading Nutrition Brand (Best Sellers) */}
        <FeaturedProducts />

        {/* Brand Story / About Us Section */}
        <About />

        {/* Categories Grid */}
        <Categories />

        {/* Health Insights & Blog Articles */}
        <Blog />

        {/* Customer Testimonials */}
        <Testimonials />

        {/* E-Commerce Platform Marketplaces availability */}
        {/* <Marketplaces /> */}

        {/* Dynamic CMS Sections */}
        <DynamicSections />
      </main>
      <Footer />
    </>
  );
}

