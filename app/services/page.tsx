import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Stethoscope, ShieldCheck, HeartPulse, Pill, PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Forever Healthcare's services - authentic Ayurvedic supplements, medical equipment retail, product setup support, and 24/7 order assistance.",
};

const services = [
  {
    icon: <Pill className="w-8 h-8" />,
    title: "Online Pharmacy",
    description: "Order genuine Ayurvedic medicines, organic supplements, and daily wellness products online with fast and reliable pan-India home delivery.",
    features: ["100% Genuine Ayurvedic items", "Eco-friendly packaging", "Easy order tracking"],
    color: "from-violet-500 to-purple-400",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    link: "/products",
    linkText: "Browse Products",
  },
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: "Medical Equipment Retail",
    description: "Equip your home with export-standard medical diagnostic devices, wellness trackers, and therapeutic aids from trusted manufacturers.",
    features: ["Quality-tested equipment", "Manufacturer warranty", "Comprehensive user manuals"],
    color: "from-emerald-500 to-green-400",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    link: "/products",
    linkText: "Explore Devices",
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Product Setup Assistance",
    description: "Setting up a newly purchased health monitor or therapy device? Our customer support agents offer virtual guidance to configure your products.",
    features: ["Step-by-step documentation", "Video tutorial library", "Toll-free configuration support"],
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    link: "/contact",
    linkText: "Contact Support",
  },
  {
    icon: <PhoneCall className="w-8 h-8" />,
    title: "24/7 Customer Care",
    description: "Get prompt answers regarding product availability, shipping updates, refund processing, and general order inquiries.",
    features: ["WhatsApp support integration", "Rapid email response times", "Live call assistance"],
    color: "from-teal-500 to-cyan-400",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
    link: "/contact",
    linkText: "Get Help",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-semibold mb-5">
              <HeartPulse className="w-4 h-4 text-medical" />
              Our Premium Services
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4">
              Healthcare <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We provide premium Ayurvedic supplements, healthcare products, and medical equipment delivered right to your doorstep.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-12 lg:pb-16 pt-6 lg:pt-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm card-hover group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${service.color} opacity-0 group-hover:opacity-[0.06] rounded-full -mr-12 -mt-12 transition-opacity duration-500`} />

                  <div className={`w-16 h-16 rounded-2xl ${service.bgLight} ${service.textColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>

                  <h2 className="text-xl font-bold font-heading text-foreground mb-3">{service.title}</h2>
                  <p className="text-muted text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                        <ShieldCheck className="w-4 h-4 text-medical flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-medical transition-colors group/link"
                  >
                    {service.linkText}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
