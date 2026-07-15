"use client";

import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
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

const points = [
  "100% Ayurvedic & Natural Products",
  "Export Quality Standards Maintained",
  "Expert Team of Healthcare Professionals",
  "Affordable & Accessible Medical Care",
  "ISO Certified Manufacturing Process",
];

export default function About() {
  return (
    <section className="pb-12 lg:pb-16 pt-6 lg:pt-8 bg-background overflow-hidden relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main decorative card */}
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/10 to-medical/10 p-8 lg:p-10">
              {/* Background shapes */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-medical/5 rounded-full -ml-12 -mb-12" />

              {/* Content card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-medical rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="9" y="2" width="6" height="20" rx="2" />
                      <rect x="2" y="9" width="20" height="6" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground font-heading">Forever Healthcare</h3>
                    <p className="text-sm text-muted">Established 2009</p>
                  </div>
                </div>

                <p className="text-foreground/70 leading-relaxed text-sm mb-6">
                  From a small Ayurvedic clinic to India&apos;s trusted healthcare brand - our journey is driven by the belief that quality healthcare should be accessible to everyone.
                </p>

                {/* Animated stats */}
                <div className="grid grid-cols-2 gap-4">
                  {aboutStats.map((stat) => (
                    <div key={stat.label} className="bg-light-gray rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold font-heading gradient-text">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs text-muted font-medium mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 bg-white rounded-2xl px-4 py-2 shadow-lg border border-gray-100 z-10"
              >
                <div className="text-xs font-bold text-medical flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Trusted by 15K+
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/10 text-primary text-sm font-semibold mb-6">
              About Us
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-heading text-foreground mb-6 leading-tight">
              We Are Committed To Your{" "}
              <span className="gradient-text">Health & Wellness</span>
            </h2>

            <p className="text-lg text-foreground/60 mb-5 leading-relaxed">
              At Forever Healthcare, we believe that your health is our priority. We are
              dedicated to providing 100% Ayurvedic solutions, trusted quality products, and
              export-standard excellence in every item we deliver.
            </p>

            <p className="text-foreground/50 mb-8 leading-relaxed">
              Our wellness program combines traditional care with modern technology. Every
              device and supplement is engineered for precision and designed for care to
              ensure you achieve the best possible health outcomes.
            </p>

            <ul className="space-y-3.5 mb-10">
              {points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-medical/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-medical" />
                  </div>
                  <span className="text-foreground/80 font-medium text-sm">{point}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-2 group text-sm"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
