"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/faqs")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const grouped = data.data.reduce((acc: any[], curr: any) => {
             const cat = acc.find(c => c.category === curr.category);
             if (cat) cat.items.push({ q: curr.question, a: curr.answer, id: curr._id });
             else acc.push({ category: curr.category, items: [{ q: curr.question, a: curr.answer, id: curr._id }] });
             return acc;
          }, []);
          setFaqs(grouped);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen">
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-slate-800 mb-4">How can we help?</h1>
            <p className="text-slate-500 mb-8 text-lg">Search our knowledge base or browse frequently asked questions below.</p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-emerald-100 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700"
              />
            </div>
          </div>
        </section>

        <section className="py-12 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            {loading ? (
              <div className="text-center py-10">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-10">No FAQs found.</div>
            ) : faqs.map((cat, catIdx) => (
              <div key={cat.category} className="mb-10">
                <h2 className="text-xl font-bold font-heading text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                  {cat.category}
                </h2>
                
                <div className="space-y-4">
                  {cat.items
                    .filter((item: any) => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()))
                    .map((item: any, itemIdx: number) => {
                    const id = `${catIdx}-${itemIdx}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={id} className={`bg-white border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-emerald-200 shadow-sm' : 'border-slate-100 hover:border-emerald-100'}`}>
                        <button 
                          onClick={() => toggleAccordion(id)}
                          className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                        >
                          <span className={`font-bold text-sm sm:text-base ${isOpen ? 'text-emerald-700' : 'text-slate-700'}`}>
                            {item.q}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50 mt-2 pt-4">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="mt-12 bg-emerald-50 rounded-3xl p-8 text-center border border-emerald-100">
              <h3 className="font-bold text-lg text-emerald-900 mb-2">Still need help?</h3>
              <p className="text-emerald-700 text-sm mb-6">Our customer support team is available 24/7 to assist you.</p>
              <div className="flex justify-center gap-4">
                <a href="/contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
