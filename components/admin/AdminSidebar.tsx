"use client";

import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, LogOut, PackageSearch, Tag, Image as ImageIcon, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: PackageSearch, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/hero-banners", icon: ImageIcon, label: "Hero Banners" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
  { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/admin/users", icon: Users, label: "Customers" },
];

export default function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex-col hidden md:flex flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="font-heading font-black text-sm flex items-center gap-1">
          <span className="text-slate-800">Forever</span>
          <span className="text-emerald-600">Healthcare</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded ml-1">CMS</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                active === item.label
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:bg-light-gray hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-danger hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Exit to Website
        </Link>
      </div>
    </aside>
  );
}
