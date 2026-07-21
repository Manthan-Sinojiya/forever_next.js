"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, LogOut, PackageSearch, Tag, Image as ImageIcon, MessageSquare, Settings, FileText, ChevronDown } from "lucide-react";

const mainNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: PackageSearch, label: "Products" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/brands", icon: Tag, label: "Brands" },
  { href: "/admin/blogs", icon: FileText, label: "Blogs" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
  { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/admin/faqs", icon: MessageSquare, label: "FAQs" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/users", icon: Users, label: "Customers" },
];

const settingsNavItems = [
  { href: "/admin/pages", icon: FileText, label: "Pages" },
  { href: "/admin/navigation", icon: Settings, label: "Navigation" },
  { href: "/admin/hero-banners", icon: ImageIcon, label: "Hero Banners" },
  { href: "/admin/homepage", icon: Settings, label: "Homepage CMS" },
  { href: "/admin/settings", icon: Settings, label: "General Settings" },
];

export default function AdminSidebar({ active }: { active: string }) {
  const isSettingsActive = settingsNavItems.some(item => item.label === active || (active === 'Settings' && item.label === 'General Settings') || active === 'Hero Banners' || active === 'Homepage CMS');
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  useEffect(() => {
    if (isSettingsActive) setSettingsOpen(true);
  }, [isSettingsActive]);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex-col hidden md:flex flex-shrink-0 z-20">
      <div className="h-24 flex items-center px-6 shrink-0">
        <div className="font-heading font-black text-lg flex items-center gap-1.5">
          <span className="text-slate-800">Forever</span>
          <span className="text-[#05b67a]">Healthcare</span>
          <span className="text-[10px] font-bold bg-[#e6f7f1] text-[#05b67a] px-2 py-0.5 rounded-sm ml-1">CMS</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200 ${
                active === item.label
                  ? "bg-[#05b67a] text-white shadow-md shadow-[#05b67a]/30"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Settings Collapsible */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200 ${
              isSettingsActive && !settingsOpen
                ? "bg-[#e6f7f1] text-[#05b67a]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <Settings className="w-5 h-5" />
              Settings
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${settingsOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
            <div className="pl-12 pr-2 py-2 space-y-1 border-l-2 border-slate-100 ml-7">
              {settingsNavItems.map((item) => {
                const isActive = active === item.label || (active === 'Settings' && item.label === 'General Settings');
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#05b67a] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 bg-white mt-auto shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 w-full py-2 px-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center text-lg font-medium shrink-0">
            N
          </div>
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 rotate-180" />
            EXIT TO WEBSITE
          </div>
        </Link>
      </div>
    </aside>
  );
}
