"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Heart,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Package,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ _id: string; name: string; category: string; price: number; imageUrl: string }[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; image?: string }[]>([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useCartStore((state) => state.wishlist?.length || 0);

  const [role, setRole] = useState("user");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [announcement, setAnnouncement] = useState("🎉 Free shipping on all orders above ₹499! Use code: EXTRA10 for 10% off");
  const [announcementBg, setAnnouncementBg] = useState("#0a8c6e");
  const [announcementStyle, setAnnouncementStyle] = useState("static");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedEmail = localStorage.getItem("userEmail");
    setRole(savedRole || "user");
    setIsLoggedIn(!!savedEmail);

    type Setting = { key: string; value: string };
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const textSetting = data.data.find((s: Setting) => s.key === "announcement");
          const bgSetting = data.data.find((s: Setting) => s.key === "announcement_bg");
          const styleSetting = data.data.find((s: Setting) => s.key === "announcement_style");

          if (textSetting?.value) setAnnouncement(textSetting.value);
          if (bgSetting?.value) setAnnouncementBg(bgSetting.value);
          if (styleSetting?.value) setAnnouncementStyle(styleSetting.value);
        }
      })
      .catch((err) => console.error("Error loading announcement settings:", err));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data.filter((c: any) => c.isActive));
        }
      })
      .catch((err) => console.error("Error loading categories:", err));

    if (savedEmail) {
      fetch(`/api/wishlist?email=${encodeURIComponent(savedEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            useCartStore.getState().setWishlist(data.data);
          }
        })
        .catch(err => console.error("Error loading wishlist:", err));
    }

    const handleStorageChange = () => {
      const email = localStorage.getItem("userEmail");
      setRole(localStorage.getItem("userRole") || "user");
      setIsLoggedIn(!!email);
      if (email) {
        fetch(`/api/wishlist?email=${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              useCartStore.getState().setWishlist(data.data);
            }
          })
          .catch(err => console.error("Error loading wishlist:", err));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setRole("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (err) {
        console.error("Failed to load search suggestions:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="text-white text-[12.5px] py-2.5 px-4 text-center font-bold tracking-wider relative z-50 overflow-hidden"
        style={{ backgroundColor: announcementBg }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center h-5">
          {announcementStyle === "scrolling" ? (
            <div className="w-full overflow-hidden whitespace-nowrap relative">
              <div className="animate-marquee-nav-active whitespace-nowrap">
                <span className="px-8">{announcement}</span>
                <span className="px-8">{announcement}</span>
                <span className="px-8">{announcement}</span>
              </div>
            </div>
          ) : (
            <span className="truncate">{announcement}</span>
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeNav {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.33%, 0, 0); }
          }
          .animate-marquee-nav-active {
            display: inline-block;
            animation: marqueeNav 25s linear infinite;
          }
        `}} />
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100"
            : "bg-white/70 backdrop-blur-md border-b border-gray-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 lg:h-20 items-center">
            {/* Logo - Forever Healthcare */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center" aria-label="Forever Healthcare Home">
                <Image
                  src="/logo/logo.png"
                  alt="Forever Healthcare"
                  width={180}
                  height={50}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.label === "Products" && setShowMegaMenu(true)}
                  onMouseLeave={() => link.label === "Products" && setShowMegaMenu(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative px-4 py-6 text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                      isActive(link.href)
                        ? "text-emerald-600"
                        : "text-foreground/80 hover:text-emerald-600"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-4 left-4 right-4 h-0.5 bg-emerald-600 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {link.label === "Products" && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 origin-top overflow-hidden z-50 ${showMegaMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                          <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase">Categories</h3>
                          <Link href="/shop" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All &rarr;</Link>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/categories/${cat.slug}`}
                              className="group/item p-3 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center text-center gap-2"
                              onClick={() => setShowMegaMenu(false)}
                            >
                              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden border border-emerald-100/50 group-hover/item:border-emerald-200 group-hover/item:shadow-sm transition-all">
                                {cat.image ? (
                                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Leaf className="w-5 h-5 text-emerald-500" />
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover/item:text-emerald-650">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 px-6 py-3 border-t border-emerald-100/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                          <Sparkles className="w-4 h-4 text-emerald-600" /> Premium Ayurvedic Formulations
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                          <Heart className="w-4 h-4 text-emerald-600" /> 100% Safe & Natural
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {showSearch ? (
                  <div className="relative flex items-center">
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={handleSearch}
                      className="flex items-center overflow-hidden"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 text-sm bg-light-gray rounded-full outline-none border border-transparent focus:border-emerald-600/30 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery("");
                          setSuggestions([]);
                        }}
                        className="ml-1 text-muted hover:text-danger p-1 transition-colors animate-in fade-in"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.form>

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50 py-2">
                        <div className="px-3 py-1.5 border-b border-slate-50">
                          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Search Suggestions</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {suggestions.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => {
                                router.push(`/products/${product._id}`);
                                setShowSearch(false);
                                setSearchQuery("");
                                setSuggestions([]);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                              <img
                                src={product.imageUrl || "/logo/logo.png"}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-150 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{product.category}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-black text-emerald-600">₹{product.price.toFixed(2)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/60 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                    aria-label="Search products"
                  >
                    <Search className="w-[18px] h-[18px]" />
                  </button>
                )}
              </AnimatePresence>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/60 hover:text-danger hover:bg-red-50 transition-all relative"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-danger text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/60 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {mounted && isLoggedIn ? (
                <div className="relative group">
                  <Link
                    href="/profile"
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/60 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative"
                    aria-label="User account"
                  >
                    <User className="w-[18px] h-[18px]" />
                  </Link>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      href="/profile?tab=Profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=Orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                      My Orders
                    </Link>
                    {mounted && role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-emerald-650 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-t border-gray-100"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-650 transition-colors border-t border-gray-100 text-left cursor-pointer bg-transparent border-none"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                mounted && (
                  <Link
                    href="/login"
                    className="px-4 py-1.5 border border-[#0D623F]/35 text-[#0D623F] hover:bg-[#EAF6F0] rounded-full font-bold text-xs transition-all active:scale-95 ml-1 select-none"
                  >
                    Login
                  </Link>
                )
              )}

              {/* Ayurveda Logo */}
              <Link href="https://ayurvedabits.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center border-l border-gray-100 pl-3.5 ml-1.5 hover:opacity-85 transition-opacity">
                <Image
                  src="/logo/ayurveda_logo.png"
                  alt="Ayurveda Logo"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-foreground/60"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground hover:bg-light-gray transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Ayurveda Logo */}
              <Link href="https://ayurvedabits.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center border-l border-gray-100 pl-2 ml-0.5 hover:opacity-85 transition-opacity">
                <Image
                  src="/logo/ayurveda_logo.png"
                  alt="Ayurveda Logo"
                  width={28}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 bg-light-gray rounded-xl outline-none border border-transparent focus:border-emerald-600/20 text-sm"
                    />

                    {/* Mobile Suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50 py-2">
                        <div className="px-3 py-1.5 border-b border-slate-50">
                          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Search Suggestions</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {suggestions.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => {
                                router.push(`/products/${product._id}`);
                                setIsOpen(false);
                                setSearchQuery("");
                                setSuggestions([]);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                              <img
                                src={product.imageUrl || "/logo/logo.png"}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-150 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{product.category}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-black text-emerald-600">₹{product.price.toFixed(2)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        isActive(link.href)
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-foreground/80 hover:bg-light-gray"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}

                {/* Mobile extra links */}
                <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-light-gray rounded-xl"
                  >
                    <Heart className="w-4 h-4" />
                    My Wishlist
                    {mounted && wishlistCount > 0 && (
                      <span className="ml-auto bg-danger text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  {mounted && isLoggedIn && (
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-light-gray rounded-xl"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  )}
                  {mounted && !isLoggedIn && (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-emerald-650 bg-emerald-50/40 hover:bg-emerald-50 rounded-xl"
                    >
                      <User className="w-4 h-4" />
                      Login / Register
                    </Link>
                  )}
                  {mounted && role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-light-gray rounded-xl text-emerald-600 bg-emerald-50/20"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  {mounted && isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl text-left cursor-pointer bg-transparent border-none"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
