import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/home/About";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Stats from "@/components/home/Stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Forever Healthcare - India's trusted premium healthcare brand with 15+ years of excellence in Ayurvedic products and medical equipment.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-semibold mb-5">
              About Forever Healthcare
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4 text-balance">
              Our Story of <span className="gradient-text">Excellence</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              From a small Ayurvedic clinic to India&apos;s trusted healthcare brand - 15+ years of commitment to your wellness.
            </p>
          </div>
        </section>

        <About />
        <Stats />
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  );
}
