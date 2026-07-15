"use client";

import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-[#164785] rounded-3xl p-8 lg:p-10 relative overflow-hidden"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-medical/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold mb-5">
                <Send className="w-3 h-3" />
                Newsletter
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold font-heading text-white mb-3">
                Stay Updated on Health Tips
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-sm">
                Subscribe to receive exclusive deals, health tips, and product
                updates straight to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-medical hover:bg-medical-dark text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-medical/25 whitespace-nowrap"
                >
                  {submitted ? "✓ Subscribed!" : "Subscribe"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-accent to-[#E0F7EC] rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical/10 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold font-heading text-foreground mb-3">
                Need Help Finding a Product?
              </h3>
              <p className="text-foreground/60 text-sm mb-6 max-w-sm">
                Get in touch with our product experts to find the right supplements and health equipment for your specific needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-white border border-gray-200 text-foreground rounded-full font-semibold text-sm hover:shadow-md transition-all text-center"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
