"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  readTime: string;
  excerpt: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "5 Ayurvedic Herbs for Relieving Stress & Fatigue",
    category: "Ayurveda",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    date: "July 14, 2026",
    readTime: "5 Min Read",
    excerpt: "Discover how ancient adaptogens like Ashwagandha and Brahmi can restore energy levels, calm the mind, and balance your body naturally.",
  },
  {
    id: "post-2",
    title: "How to Correctly Measure Blood Pressure at Home",
    category: "Home Care",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    date: "July 12, 2026",
    readTime: "4 Min Read",
    excerpt: "Avoid common errors when tracking your blood pressure. Learn the step-by-step method to get medical-grade accuracy every single time.",
  },
  {
    id: "post-3",
    title: "Why Natural Vitamin C & Zinc Are Key for Immunity",
    category: "Nutrition",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    date: "July 10, 2026",
    readTime: "6 Min Read",
    excerpt: "Why are natural dietary sources superior to synthetic vitamins? Explore the biological absorption benefits of organic supplements.",
  },
];

export default function Blog() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-medical/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Latest Insights
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-heading text-slate-800">
              Health Articles & <span className="gradient-text">Wellness Tips</span>
            </h2>
            <p className="text-muted text-sm mt-2 max-w-xl">
              Read our curated collection of health guides written by certified healthcare and Ayurvedic experts.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group self-start md:self-end"
          >
            Explore Wellness Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, idx) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="block group">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-50/90 backdrop-blur border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta details */}
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-800 font-heading mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read Button */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
                      Read Full Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
