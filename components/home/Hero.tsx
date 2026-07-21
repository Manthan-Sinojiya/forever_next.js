"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Slide {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  showOverlay?: boolean;
}

const FALLBACK_SLIDES: Slide[] = [
  {
    _id: "fb-1",
    title: "Ayurvedic Health Juices",
    subtitle: "Two Daily Choices. One Healthier You.",
    imageUrl: "/banner/first.png",
    buttonText: "Shop Now",
    buttonLink: "/products",
    showOverlay: false,
  },
  {
    _id: "fb-2",
    title: "Premium Medical Equipment",
    subtitle: "High-end medical devices for professionals and homes.",
    imageUrl: "/banner/second.png",
    buttonText: "Shop Now",
    buttonLink: "/products",
    showOverlay: false,
  },
  {
    _id: "fb-3",
    title: "Ayurvedic Wellness",
    subtitle: "Natural organic supplements and herbs.",
    imageUrl: "/banner/third.png",
    buttonText: "Explore",
    buttonLink: "/products",
    showOverlay: false,
  }
];

export default function Hero() {
  const [slides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Commented out to force using local fallback slides (the new banner images)
    // fetch("/api/hero-slides")
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.success && res.data && res.data.length > 0) {
    //       setSlides(res.data);
    //       setCurrent(0);
    //     }
    //   })
    //   .catch((err) => console.log("Error fetching slides:", err));
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

  if (!slides || slides.length === 0 || !slides[current]) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="w-full bg-white relative">
      {/* ── Slide Banner Container ── */}
      <div 
        className="relative w-full overflow-hidden bg-[#eef2f3]"
        style={{ aspectRatio: "1280 / 420" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={slides[current].buttonLink || "#"} className="absolute inset-0 block w-full h-full">
              <Image
                src={slides[current].imageUrl}
                alt={slides[current].title || "Hero Banner"}
                fill
                priority
                unoptimized
                quality={100}
                className="object-cover object-center transition-all duration-1000"
                style={{ transform: "translateZ(0)" }} // Prevents blurry rendering on composite layers
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slide Controls (if multiple slides) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-white text-slate-800 flex items-center justify-center transition-colors z-20 border border-slate-100 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 ml-0.5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-white text-slate-800 flex items-center justify-center transition-colors z-20 border border-slate-100 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 mr-0.5" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                    current === index 
                      ? "w-2.5 h-2.5 bg-[#0a8c6e]" 
                      : "w-2.5 h-2.5 bg-white border border-slate-200 hover:bg-slate-50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

