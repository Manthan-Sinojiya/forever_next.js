"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Regular Customer",
    initials: "SJ",
    color: "from-pink-500 to-rose-400",
    content:
      "Forever Healthcare has completely changed how I manage my family's wellness. The Ayurvedic supplements are top-notch and delivery is always on time. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Fitness Coach",
    initials: "MC",
    color: "from-blue-500 to-cyan-400",
    content:
      "As a fitness coach, I only recommend the best to my clients. The Men's Vitality Booster and protein supplements here are of export standard quality. Great experience!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Verified Buyer",
    initials: "PS",
    color: "from-emerald-500 to-green-400",
    content:
      "The digital blood pressure monitor I bought works perfectly. Very easy to use and accurate. Their customer support team even helped me set it up remotely!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Returning Customer",
    initials: "RK",
    color: "from-violet-500 to-purple-400",
    content:
      "I've been ordering from Forever Healthcare for over 2 years now. The quality is consistent, prices are fair, and their app makes reordering super easy.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "Health Enthusiast",
    initials: "AD",
    color: "from-amber-500 to-orange-400",
    content:
      "The Ayurvedic herbal teas and immune boosters have become a daily essential for my family. We trust Forever Healthcare with our health needs.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const visibleTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const nextPage = useCallback(() => {
    setCurrentPage((p) => (p >= totalPages - 1 ? 0 : p + 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => (p <= 0 ? totalPages - 1 : p - 1));
  }, [totalPages]);

  useEffect(() => {
    const timer = setInterval(nextPage, 5000);
    return () => clearInterval(timer);
  }, [nextPage]);

  return (
    <section className="section-padding bg-light-gray relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl opacity-60 -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-primary text-sm font-semibold mb-5 shadow-sm"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Customer Reviews
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground"
            >
              What Our Patients <span className="gradient-text">Say</span>
            </motion.h2>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPage}
              className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${currentPage}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 card-hover relative group"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/5 group-hover:text-primary/10 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/60 text-sm mb-6 leading-relaxed relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm font-heading text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Page indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentPage
                  ? "w-8 h-2 bg-gradient-to-r from-primary to-medical"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
