"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, Clock, Leaf, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface Slide {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

const FALLBACK_SLIDES: Slide[] = [
  {
    _id: "fb-1",
    title: "100% Organic Ayurvedic Health Solutions",
    subtitle: "Authentic Herbs & Natural Supplements Direct from Himalayan Valleys",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Explore Ayurveda",
    buttonLink: "/products",
  },
  {
    _id: "fb-2",
    title: "Premium Home Healthcare Equipment",
    subtitle: "Up to 40% Off on Certified BP Monitors, Oximeters & Nebulizers",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Shop Equipment",
    buttonLink: "/products",
  },
  {
    _id: "fb-3",
    title: "Vitals & Nutritional Wellness",
    subtitle: "Daily Multivitamins, Fish Oils & Stamina Boosters",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80",
    buttonText: "Get Nutrition",
    buttonLink: "/products",
  }
];

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      })
      .catch((err) => console.log("Error fetching slides:", err));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* ── Slide Banner Container ── */}
      <div className="relative h-[480px] md:h-[550px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
              style={{ backgroundImage: `url('${slides[current].imageUrl}')` }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            
            {/* Slide Content */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center z-10">
              <div className="max-w-2xl text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  PREMIUM WELLNESS STORE
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white leading-tight mb-4"
                >
                  {slides[current].title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/80 text-sm md:text-lg mb-8 max-w-lg font-medium"
                >
                  {slides[current].subtitle}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link
                    href={slides[current].buttonLink}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    <Leaf className="w-4 h-4" />
                    {slides[current].buttonText}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Controls (if multiple slides) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    current === index ? "w-8 bg-emerald-500" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Highlights Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { icon: <Truck className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: "Free Shipping", sub: "Orders above ₹999" },
              { icon: <Clock className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: "24/7 Helpline", sub: "Always here for you" },
              { icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: "Secure Checkout", sub: "100% safe payments" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 px-4 sm:px-8 py-5">
                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted font-medium">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
