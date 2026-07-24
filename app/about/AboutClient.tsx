"use client";

import { motion } from "framer-motion";
import { Leaf, HeartPulse, Award, ShieldCheck, Users, Target, Activity, Stethoscope } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/ui/PageBanner";

const VALUES = [
  { icon: Leaf, title: "Pure Ayurveda", desc: "Sourced directly from authentic farms, ensuring 100% natural ingredients without harmful chemicals." },
  { icon: ShieldCheck, title: "Clinically Proven", desc: "Every product undergoes rigorous testing in WHO-GMP certified facilities to guarantee safety and efficacy." },
  { icon: HeartPulse, title: "Holistic Wellness", desc: "We focus on healing the root cause of ailments, not just suppressing symptoms, for long-term health." },
  { icon: Award, title: "Premium Quality", desc: "From sourcing to packaging, we maintain the highest standards of quality control in the industry." },
];

const STATS = [
  { value: "15+", label: "Years of Trust", icon: Award },
  { value: "15L+", label: "Happy Customers", icon: Users },
  { value: "50+", label: "Expert Doctors", icon: Stethoscope },
  { value: "100%", label: "Natural Ingredients", icon: Leaf },
];

export default function AboutClient({ banner }: { banner?: any }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-[#F8FAFC]">
        {/* Dynamic Banner or Fallback Hero Section */}
        {banner ? (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <PageBanner
              banner={banner}
              defaultTitle="About Forever Healthcare"
              defaultSubtitle="Bridging Ayurveda & Modern Science for holistic health and wellness."
              badge="About Us"
            />
          </div>
        ) : (
          <section className="relative bg-gradient-to-br from-[#1E5AA8] via-[#2A75C3] to-[#43B97F] overflow-hidden py-24 lg:py-32">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#43B97F]/30 rounded-full blur-3xl"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center text-white">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                    <Activity className="w-4 h-4" /> About Forever Healthcare
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-heading mb-6 leading-tight">
                    Bridging <span className="text-[#43B97F]">Ayurveda</span> & Modern Science
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    We are on a mission to make premium, authentic healthcare accessible to everyone. Experience the power of nature backed by clinical research.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        )}


        {/* Our Story & Mission */}
        <section className="py-20 lg:py-28 relative -mt-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[100px] -z-10 opacity-50"></div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800 mb-6">Our Journey to Better Health</h2>
                  <div className="space-y-5 text-slate-600 leading-relaxed text-lg">
                    <p>
                      Founded in 2010, Forever Healthcare began with a simple belief: <strong className="text-slate-800">true wellness comes from nature, validated by science.</strong>
                    </p>
                    <p>
                      What started as a small Ayurvedic clinic in Mumbai has grown into a trusted national brand, serving over 15 Lakh customers across India. We recognized the gap between traditional wisdom and modern lifestyle needs, and set out to bridge it.
                    </p>
                    <p>
                      Today, we formulate premium supplements, personal care products, and provide reliable medical equipment—all designed to support your holistic journey towards a healthier, happier life.
                    </p>
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl flex-1 border border-emerald-100">
                      <Target className="w-8 h-8 text-emerald-600 mb-3" />
                      <h4 className="font-bold text-slate-800 mb-1">Our Mission</h4>
                      <p className="text-sm text-slate-500 font-medium">To democratize access to premium, authentic Ayurvedic healthcare.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl flex-1 border border-blue-100">
                      <HeartPulse className="w-8 h-8 text-[#1E5AA8] mb-3" />
                      <h4 className="font-bold text-slate-800 mb-1">Our Vision</h4>
                      <p className="text-sm text-slate-500 font-medium">A world where preventive, natural healthcare is the first choice.</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" alt="Ayurvedic Herbs" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl">
                    <p className="font-bold text-slate-800 text-lg">&quot;Nature is the best physician.&quot;</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">— Ancient Ayurvedic Proverb</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2rem] text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <stat.icon className="w-10 h-10 mx-auto text-emerald-500 mb-4" />
                  <h3 className="text-4xl font-black font-heading text-slate-800 mb-2">{stat.value}</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800 mb-4">The Pillars of Our Promise</h2>
              <p className="text-slate-500 text-lg">We don&apos;t compromise on quality. Our core values dictate every product we formulate and every service we provide.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
                    <val.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-800 mb-3">{val.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
