"use client";

import { motion } from "framer-motion";
import {
  Pill,
  Activity,
  HeartPulse,
  Stethoscope,
  Microscope,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: <Pill className="w-7 h-7" />,
    title: "Online Pharmacy",
    description:
      "Order Ayurvedic medicines and health supplements online with fast, secure, and reliable pan-India home delivery.",
    color: "from-violet-500 to-purple-400",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    icon: <HeartPulse className="w-7 h-7" />,
    title: "Medical Equipment Retail",
    description:
      "Equip your home with export-standard medical diagnostic devices and wellness trackers.",
    color: "from-emerald-500 to-green-400",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    icon: <Stethoscope className="w-7 h-7" />,
    title: "Product Setup Support",
    description:
      "Our technicians provide remote guidance to help you install and operate your medical devices.",
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: <PhoneCall className="w-7 h-7" />,
    title: "24/7 Order Support",
    description:
      "Round-the-clock help for order tracking, queries, shipping status, and replacement assistance.",
    color: "from-teal-500 to-cyan-400",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-medical/3 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/10 text-primary text-sm font-semibold mb-5"
          >
            <HeartPulse className="w-4 h-4 text-medical" />
            Our Services
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4"
          >
            Comprehensive Healthcare{" "}
            <span className="gradient-text">Solutions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-xl mx-auto"
          >
            We provide world-class medical services and certified products to
            ensure your health and well-being are always prioritized.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm card-hover group relative overflow-hidden h-full flex flex-col">
                {/* Hover accent */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${service.color} opacity-0 group-hover:opacity-[0.06] rounded-full -mr-12 -mt-12 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${service.bgLight} ${service.textColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                >
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold font-heading text-foreground mb-2.5 relative z-10">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-5 flex-1 relative z-10">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-medical transition-colors relative z-10"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
