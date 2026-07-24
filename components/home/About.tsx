"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Users, Target, Compass, Leaf, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const aboutStats = [
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 15, suffix: "K+", label: "Happy Customers" },
  { value: 500, suffix: "+", label: "Products" },
  { value: 50, suffix: "+", label: "Expert Doctors" },
];

export default function About({ isPage = false, title, description, image }: { isPage?: boolean, title?: string, description?: string, image?: string }) {
  if (!isPage) {
    return (
      <section className="py-20 bg-white overflow-hidden relative" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left - Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] aspect-[4/3] group bg-slate-50">
                <Image
                  src={image || "/about-ayurveda.png"}
                  alt="Forever Healthcare Ayurvedic Purity"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 right-8 bg-white rounded-2xl px-5 py-3 shadow-xl border border-slate-50 z-10 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#43B97F]" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Standards</p>
                  <p className="text-sm font-black text-slate-800 leading-none">ISO Certified</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Brief Content & counters */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6 lg:pl-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF8F2] text-[#43B97F] text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-current" /> ABOUT FOREVER HEALTHCARE
              </div>

              <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-800 leading-tight">
                {title ? (
                  <span dangerouslySetInnerHTML={{ __html: title.replace(/Health & Purity/g, '<span class="text-[#43B97F]">Health & Purity</span>') }} />
                ) : (
                  <>We Are Committed To Your <span className="text-[#43B97F]">Health & Purity</span></>
                )}
              </h2>

              <p className="text-slate-500 leading-relaxed font-medium">
                {description || "At Forever Healthcare, we believe that your health is our priority. We are dedicated to providing 100% Ayurvedic solutions, trusted quality products, and export-standard excellence in every item we deliver."}
              </p>

              {/* Counter grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                {aboutStats.map((stat) => (
                  <div key={stat.label} className="bg-[#F8FAFC] rounded-[1.5rem] p-4 text-center hover:bg-slate-100 transition-colors">
                    <div className="text-2xl font-black text-slate-900 mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    );
  }

  // FULL DEDICATED ABOUT PAGE VERSION
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative" id="about">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-full w-[550px] h-[550px] bg-emerald-550/5 bg-emerald-550/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Tagline Showcase */}
        <div className="text-center mb-16">
          <div className="inline-flex gap-3 md:gap-5 flex-wrap px-6 py-2.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm text-xs font-black uppercase tracking-widest text-slate-500">
            <span className="text-slate-800">Recharge</span>
            <span className="text-emerald-500 font-black animate-pulse">•</span>
            <span className="text-emerald-700">Refresh</span>
            <span className="text-blue-500 font-black animate-pulse">•</span>
            <span className="text-blue-700">Restart</span>
          </div>
        </div>

        {/* Section 1: Intro Story & Yoga Image */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          
          {/* Left Column - Yoga Visual Photo with badge overlays */}
          <div className="lg:col-span-6 relative">
            {/* Background design accents */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

            {/* Main Rounded Image (Yoga/Wellness) */}
            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl aspect-[4/3] group bg-slate-55 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                alt="Wellness and Yoga Rejuvenation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Badge 1 (Top Right) */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quality Standards</p>
                  <p className="text-xs font-black text-slate-800">ISO 9001 Certified</p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Left) */}
            <div className="absolute -bottom-6 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Happy Patients</p>
                  <p className="text-xs font-black text-slate-800">
                    <AnimatedCounter end={15} suffix="K+" /> Trusted Users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Story Intro */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600 animate-pulse" /> Discover Wellness
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-800 leading-tight">
              We Are Committed To Your <span className="gradient-text font-black">Health & Purity</span>
            </h2>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              At Forever Healthcare, we believe that health is not just the absence of disease, but a state of complete physical, mental, and spiritual well-being. We combine authentic Ayurvedic roots with modern scientific validation to deliver premium products you can rely on daily.
            </p>

            {/* Core Stats counters */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-805 text-slate-808 text-slate-800">15+</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">Years of Excellence</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">50+</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">Expert Doctors</p>
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-[2rem] p-8 hover:border-emerald-250 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-650 text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Our Mission</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
              Our mission is to deliver natural and reliable healthcare solutions that enhance everyday life. We aim to make Ayurvedic wellness globally accessible by offering products that are safe, affordable, and effective.
            </p>
          </div>

          <div className="bg-blue-50/20 border border-blue-100/40 rounded-[2rem] p-8 hover:border-blue-250 hover:bg-blue-50/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Our Vision</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
              We envision a world where natural healing becomes a part of every household. By promoting herbal and toxin-free solutions, we strive to empower people to live healthier, more balanced lives.
            </p>
          </div>

        </div>

        {/* Section 3: What Makes Us Different Grid */}
        <div className="space-y-8 mb-20">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1 text-emerald-600 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-500" /> Core Values
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800">What Makes Us Different</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">How we outpace conventional standards to deliver premium care.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Leaf, title: "Ayurvedic Principles", desc: "Rooted in authentic, time-tested Ayurvedic systems." },
              { icon: ShieldCheck, title: "Chemical-Free", desc: "Focus on natural ingredients without toxic additives." },
              { icon: Sparkles, title: "Uncompromising Quality", desc: "Deep commitment to safety, purity, and sustainability." },
              { icon: Heart, title: "Modern Design", desc: "Products carefully engineered for modern lifestyle habits." },
              { icon: Globe, title: "Global Outreach", desc: "Always focusing on a customer-first service approach." },
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-slate-50/50 border border-slate-100 hover:border-emerald-200 hover:bg-white rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group text-center flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 leading-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Closing Quote Banner */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-[#1E5AA8] rounded-[2rem] p-8 md:p-12 text-center text-white shadow-xl overflow-hidden group">
          {/* Glowing overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Heart className="w-8 h-8 mx-auto fill-white text-white animate-pulse" />
            <p className="text-base md:text-xl font-medium italic leading-relaxed">
              "At Forever Healthcare, we don’t just create products—we create a lifestyle centered around health, purity, and long-term wellness."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
