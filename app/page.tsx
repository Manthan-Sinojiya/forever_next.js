import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import DealsAndCoupons from "@/components/home/DealsAndCoupons";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Stats from "@/components/home/Stats";
import Blog from "@/components/home/Blog";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        {/* <Services /> */}
        <DealsAndCoupons />
        <Stats />
        <FeaturedProducts />
        <Categories />
        <WhyChooseUs />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
