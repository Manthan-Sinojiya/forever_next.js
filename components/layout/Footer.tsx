import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Share2, Users, Heart, ArrowUpRight, Leaf } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/profile", label: "My Profile" },
  { href: "/contact", label: "Contact Us" },
];

const categories = [
  { href: "/products?category=Food%20Supplements", label: "Food Supplements" },
  { href: "/products?category=Healthcare%20Equipments", label: "Healthcare Equipment" },
  { href: "/products?category=Men%20Health", label: "Men Health" },
  { href: "/products?category=Personal%20Care", label: "Personal Care" },
];

const policies = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/faq", label: "FAQ" },
];

const socialLinks = [
  { href: "#", icon: <Globe className="w-4 h-4" />, label: "Website", hoverColor: "hover:bg-blue-500" },
  { href: "#", icon: <Share2 className="w-4 h-4" />, label: "Social", hoverColor: "hover:bg-pink-500" },
  { href: "#", icon: <Users className="w-4 h-4" />, label: "Community", hoverColor: "hover:bg-sky-500" },
  { href: "#", icon: <Heart className="w-4 h-4" />, label: "Support", hoverColor: "hover:bg-red-500" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-650/5 bg-emerald-600/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
          {/* Brand - takes 2 cols on large screens */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center" aria-label="Forever Healthcare Home">
              <Image
                src="/logo/logo.png"
                alt="Forever Healthcare"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-white/50 leading-relaxed text-sm max-w-sm">
              India&apos;s trusted premium brand providing 100% organic wellness, supplements, and healthcare essentials. Discover Forever Healthcare.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white ${social.hoverColor} hover:border-transparent transition-all duration-300`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-emerald-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-medical-light transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-medical-light" />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-medical-light" />
                </div>
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-medical-light" />
                </div>
                <span>support@foreverhealthcare.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Forever Healthcare Pvt. Ltd. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            {policies.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
