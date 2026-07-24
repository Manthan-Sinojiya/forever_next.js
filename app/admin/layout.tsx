"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Tags,
  Tag,
  ShoppingCart, 
  Users,
  Image as ImageIcon,
  FileText,
  MessageCircleQuestion,
  MessageSquare,
  Navigation,
  PanelBottom,
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  CheckCircle2,
  MoreVertical
} from "lucide-react";

const SIDEBAR_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    label: "Store",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
    ]
  },
  {
    label: "People",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
      { label: "Contact", href: "/admin/contact", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: FileText },
    ]
  },
  {
    label: "Content",
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Banners", href: "/admin/banners", icon: ImageIcon },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "CMS Pages", href: "/admin/cms", icon: FileText },
      { label: "Custom Pages", href: "/admin/custompages", icon: FileText },
      { label: "FAQs", href: "/admin/faqs", icon: MessageCircleQuestion },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ]
  },
  {
    label: "System",
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: Navigation },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom },
      { label: "Activity Logs", href: "/admin/activity-logs", icon: FileText },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  coupons: "Coupons",
  customers: "Customers",
  reviews: "Reviews",
  contact: "Contact Messages",
  newsletter: "Newsletter",
  media: "Media Library",
  banners: "Banners",
  blog: "Blog Articles",
  cms: "CMS Pages",
  custompages: "Custom Pages",
  faqs: "FAQs",
  testimonials: "Testimonials",
  navigation: "Navigation",
  footer: "Footer",
  "activity-logs": "Activity Logs",
  settings: "Settings",
  "office-hours": "Office Hours",
};

const ENTITY_ACTION_LABELS: Record<string, { edit: string; new: string }> = {
  products: { edit: "Edit Product", new: "New Product" },
  categories: { edit: "Edit Category", new: "New Category" },
  blog: { edit: "Edit Article", new: "New Article" },
  custompages: { edit: "Edit Custom Page", new: "New Custom Page" },
  navigation: { edit: "Edit Navigation", new: "New Item" },
  banners: { edit: "Edit Banner", new: "New Banner" },
  coupons: { edit: "Edit Coupon", new: "New Coupon" },
  faqs: { edit: "Edit FAQ", new: "New FAQ" },
  testimonials: { edit: "Edit Testimonial", new: "New Testimonial" },
  orders: { edit: "Order Details", new: "New Order" },
  customers: { edit: "Customer Details", new: "New Customer" },
  contact: { edit: "Contact Details", new: "New Message" },
};

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'admin')) {
    return [
      { label: "Admin", href: "/admin", isLast: false },
      { label: "Dashboard", href: "/admin", isLast: true }
    ];
  }

  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];
  let currentPath = "";

  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === parts.length - 1;
    const prevPart = index > 0 ? parts[index - 1] : "";

    let label = "";

    if (ENTITY_ACTION_LABELS[prevPart]) {
      if (part.toLowerCase() === "new" || part.toLowerCase() === "create") {
        label = ENTITY_ACTION_LABELS[prevPart].new;
      } else {
        label = ENTITY_ACTION_LABELS[prevPart].edit;
      }
    } else if (ROUTE_LABELS[part]) {
      label = ROUTE_LABELS[part];
    } else if (/^[0-9a-fA-F]{24}$/.test(part) || /^[0-9a-fA-F-]{12,}$/.test(part)) {
      label = "Edit";
    } else {
      label = part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    breadcrumbs.push({
      label,
      href: currentPath,
      isLast
    });
  });

  return breadcrumbs;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("storage"));
    await signOut({ redirect: false });
    router.push("/");
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.admin-profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-600/20">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-slate-900">Forever</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 80,
          x: 0
        }}
        className={`
          fixed md:sticky top-0 left-0 h-screen flex-shrink-0 z-50
          bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.01)]
          flex flex-col transition-all duration-300 ease-in-out
          ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 flex-shrink-0">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap"
              >
                Forever
              </motion.span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3 space-y-8">
          {SIDEBAR_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {group.label}
                  </p>
                </div>
              )}
              
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        className={`
                          relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm shadow-indigo-100/50' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                        title={!isSidebarOpen ? item.label : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-sidebar-pill"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full"
                          />
                        )}
                        <item.icon 
                          size={18} 
                          className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                        />
                        {isSidebarOpen && (
                          <span className="whitespace-nowrap">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@forever.com</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen pt-16 md:pt-0">
        {/* Top Header */}
        <header className={`
          sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8
          transition-all duration-300
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm' 
            : 'bg-transparent border-b border-transparent'
          }
        `}>
          {/* Left side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              {getBreadcrumbs(pathname).map((crumb, idx) => (
                <React.Fragment key={crumb.href + idx}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  {crumb.isLast ? (
                    <span className="font-medium text-slate-900">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link 
                      href={crumb.href} 
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Global Search */}
            <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm shadow-slate-100 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-full ml-2 text-slate-700 placeholder:text-slate-400"
              />
              <div className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded text-[10px] font-medium text-slate-500">
                /
              </div>
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#F8FAFC]"></span>
            </button>
            
            {/* User Dropdown */}
            <div className="relative admin-profile-dropdown">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white border border-slate-200 shadow-sm hover:border-indigo-200 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  A
                </div>
                <span className="text-sm font-medium hidden sm:block text-slate-700">Admin</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-medium text-slate-900">Admin User</p>
                      <p className="text-xs text-slate-500 mt-0.5">admin@forever.com</p>
                    </div>
                    <div className="p-2">
                      <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Settings size={16} />
                        Account Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
