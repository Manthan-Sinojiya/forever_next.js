"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, Share2, Users, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [categories, setCategories] = useState<{ href: string; label: string }[]>([]);
  const [quickLinks, setQuickLinks] = useState<{ href: string; label: string }[]>([]);
  const [policies, setPolicies] = useState<{ href: string; label: string }[]>([]);
  
  const [settings, setSettings] = useState<any>({
    address: "Mumbai, Maharashtra, India",
    storePhone: "+91 123 456 7890",
    storeEmail: "support@foreverhealthcare.in",
    footerAboutText: "India's trusted premium brand providing 100% organic wellness, supplements, and healthcare essentials. Discover Forever Healthcare.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      whatsapp: "#"
    }
  });

  useEffect(() => {
    // Fetch Settings
    const cachedSettings = sessionStorage.getItem("footer_settings");
    if (cachedSettings) {
      setSettings(JSON.parse(cachedSettings));
    } else {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            if (data.data.length > 0) {
               const s = data.data[0];
               if (s.storeEmail) {
                 setSettings(s);
                 sessionStorage.setItem("footer_settings", JSON.stringify(s));
               }
            }
          } else if (data.success && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
             setSettings(data.data);
             sessionStorage.setItem("footer_settings", JSON.stringify(data.data));
          }
        })
        .catch((err) => console.error("Error loading settings:", err));
    }

    // Fetch Categories
    const cachedCategories = sessionStorage.getItem("footer_categories");
    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    } else {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const activeCategories = data.data
              .filter((c: any) => c.isActive)
              .map((c: any) => ({
                href: `/categories/${c.slug}`,
                label: c.name,
              }));
            const topCategories = activeCategories.slice(0, 5);
            setCategories(topCategories);
            sessionStorage.setItem("footer_categories", JSON.stringify(topCategories));
          }
        })
        .catch((err) => console.error("Error loading categories in footer:", err));
    }

    // Fetch Quick Links
    const cachedQuickLinks = sessionStorage.getItem("footer_quick_links");
    if (cachedQuickLinks) {
      setQuickLinks(JSON.parse(cachedQuickLinks));
    } else {
      fetch("/api/menus/Footer Quick Links")
        .then(res => res.json())
        .then(data => {
           let links = [];
           if (data.success && data.data?.links) {
              links = data.data.links.filter((l: any) => l.isActive).sort((a: any, b: any) => a.order - b.order).map((l: any) => ({ href: l.url, label: l.label }));
           }
           if (links.length === 0) {
              links = [
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Products" },
                { href: "/profile", label: "My Profile" },
                { href: "/contact", label: "Contact Us" },
              ];
           }
           setQuickLinks(links);
           sessionStorage.setItem("footer_quick_links", JSON.stringify(links));
        }).catch(() => {
          setQuickLinks([
            { href: "/about", label: "About Us" },
            { href: "/products", label: "Products" },
            { href: "/profile", label: "My Profile" },
            { href: "/contact", label: "Contact Us" },
          ]);
        });
    }

    // Fetch Policy Links
    const cachedPolicies = sessionStorage.getItem("footer_policies");
    if (cachedPolicies) {
      setPolicies(JSON.parse(cachedPolicies));
    } else {
      fetch("/api/menus/Footer Policy Links")
        .then(res => res.json())
        .then(data => {
           let links = [];
           if (data.success && data.data?.links) {
              links = data.data.links.filter((l: any) => l.isActive).sort((a: any, b: any) => a.order - b.order).map((l: any) => ({ href: l.url, label: l.label }));
           } 
           if (links.length === 0) {
              links = [
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-conditions", label: "Terms & Conditions" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/faq", label: "FAQ" },
              ];
           }
           setPolicies(links);
           sessionStorage.setItem("footer_policies", JSON.stringify(links));
        }).catch(() => {
          setPolicies([
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms-conditions", label: "Terms & Conditions" },
            { href: "/refund-policy", label: "Refund Policy" },
            { href: "/faq", label: "FAQ" },
          ]);
        });
    }

  }, []);

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
            <Link href="/" className="inline-block bg-white/95 p-3 rounded-2xl shadow-sm mb-2 hover:bg-white transition-colors" aria-label="Forever Healthcare Home">
              <Image
                src={(settings?.logo && settings.logo.trim() !== "") ? settings.logo : "/logo/logo.png"}
                alt={settings.storeName || "Forever Healthcare"}
                width={180}
                height={50}
                className="h-9 md:h-10 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-white/50 leading-relaxed text-sm max-w-sm">
              {settings.footerAboutText || "India's trusted premium brand providing 100% organic wellness, supplements, and healthcare essentials. Discover Forever Healthcare."}
            </p>

            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-pink-600 hover:border-transparent transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-sky-500 hover:border-transparent transition-all duration-300">
                  <Users className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a href={settings.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-green-600 hover:border-transparent transition-all duration-300">
                  <Heart className="w-4 h-4" />
                </a>
              )}
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
                <span>{settings.address || "Mumbai, Maharashtra, India"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-medical-light" />
                </div>
                <span>{settings.storePhone || "+91 123 456 7890"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-medical-light" />
                </div>
                <span>{settings.storeEmail || "support@foreverhealthcare.in"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {settings.footerCopyrightText || (settings.storeName ? `${settings.storeName} Pvt. Ltd.` : "Forever Healthcare Pvt. Ltd.")} All rights reserved.
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
