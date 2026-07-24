"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Heart, MapPin, Star, LogOut,
  Edit2, Save, X, Phone, Mail, ChevronRight,
  Clock, CheckCircle2, Truck, ShoppingBag, Camera, Printer
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "next-auth/react";

type Tab = "Profile" | "Orders" | "Wishlist" | "Addresses" | "Reviews";

const TABS: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: "Profile", icon: User, label: "Profile" },
  { id: "Orders", icon: Package, label: "My Orders" },
  { id: "Wishlist", icon: Heart, label: "Wishlist" },
  { id: "Addresses", icon: MapPin, label: "Addresses" },
  { id: "Reviews", icon: Star, label: "Reviews" },
];

interface Order {
  _id: string;
  orderId?: string;
  orderNumber?: string;
  status: string;
  orderStatus: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items?: Array<{ name: string; quantity: number; price: number; imageUrl?: string }>;
}

interface Address {
  _id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

function useIsMounted() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const STATUS_COLOR: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Shipped: "bg-blue-50 text-blue-700 border-blue-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
  "Out for Delivery": "bg-purple-50 text-purple-700 border-purple-100",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  Delivered: CheckCircle2,
  Shipped: Truck,
  Processing: Clock,
  "Out for Delivery": Truck,
  Cancelled: X,
};

function ProfileContent() {
  const mounted = useIsMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "Profile";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses] = useState<Address[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const wishlist = useCartStore((s) => s.wishlist || []);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guest User";
    const email = localStorage.getItem("userEmail") || "";
    const phone = localStorage.getItem("userPhone") || "";
    setUserName(name);
    setUserEmail(email);
    setEditName(name);
    setEditPhone(phone);

    if (!email) {
      router.push("/login");
      return;
    }

    fetch(`/api/profile?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(j => {
        if (j.success && j.data) {
          setUserName(j.data.name);
          setEditName(j.data.name);
          setEditPhone(j.data.phone || "");
          localStorage.setItem("userName", j.data.name);
          if (j.data.phone) localStorage.setItem("userPhone", j.data.phone);
        }
      })
      .catch(console.error);

    setOrdersLoading(true);
    fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(j => { if (j.success) setOrders(j.data || []); })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [router]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: editName, phone: editPhone })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userName", editName);
        localStorage.setItem("userPhone", editPhone);
        setUserName(editName);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
      setEditMode(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
    window.dispatchEvent(new Event("storage"));
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch (err) {
      console.error("Profile logout error:", err);
      window.location.href = "/login";
    }
  };

  const avatar = userName?.charAt(0)?.toUpperCase() || "U";

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-10">
          <div className="container mx-auto px-4 flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading">{userName}</h1>
              <p className="text-white/70 text-sm mt-0.5">{userEmail}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {orders.length} Orders
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {wishlist.length} Wishlist
                </span>
              </div>
            </div>
            <button onClick={handleLogout}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold transition-all">
              <LogOut className="w-3.5 h-3.5" />Logout
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <aside className="w-full lg:w-60 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all border-l-[3px] ${isActive
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      {tab.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                  {/* PROFILE TAB */}
                  {activeTab === "Profile" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading font-bold text-slate-800 text-lg">Personal Information</h2>
                        {!editMode ? (
                          <button onClick={() => setEditMode(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200">
                            <Edit2 className="w-3.5 h-3.5" />Edit
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => setEditMode(false)}
                              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                              Cancel
                            </button>
                            <button onClick={handleSaveProfile} disabled={savingProfile}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-60">
                              <Save className="w-3.5 h-3.5" />
                              {savingProfile ? "Saving…" : "Save"}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {[
                          { label: "Full Name", icon: User, value: editName, setter: setEditName, type: "text", editable: true },
                          { label: "Email Address", icon: Mail, value: userEmail, setter: () => {}, type: "email", editable: false },
                          { label: "Phone Number", icon: Phone, value: editPhone, setter: setEditPhone, type: "tel", editable: true },
                        ].map((field) => (
                          <div key={field.label}>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              {field.label}
                            </label>
                            <div className="relative">
                              <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input type={field.type} value={field.value}
                                onChange={e => field.editable && field.setter(e.target.value)}
                                disabled={!editMode || !field.editable}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 disabled:opacity-70 focus:outline-none focus:border-emerald-500/40 focus:bg-white transition-all"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
                        <div className="flex flex-wrap gap-3">
                          <Link href="/orders/track"
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-all">
                            <Truck className="w-4 h-4" />Track Order
                          </Link>
                          <Link href="/offers"
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100 hover:bg-amber-100 transition-all">
                            <Star className="w-4 h-4" />View Offers
                          </Link>
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all">
                            <LogOut className="w-4 h-4" />Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORDERS TAB */}
                  {activeTab === "Orders" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-heading font-bold text-slate-800 text-lg">My Orders</h2>
                        <Link href="/orders/track" className="text-sm text-emerald-600 font-bold hover:underline flex items-center gap-1">
                          Track Order <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      {ordersLoading ? (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                          <ShoppingBag className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                          <h3 className="font-bold text-slate-700 mb-1">No orders yet</h3>
                          <p className="text-slate-400 text-sm mb-5">Start shopping to see your orders here.</p>
                          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
                            Shop Now
                          </Link>
                        </div>
                      ) : (
                        orders.map((order) => {
                          const status = order.orderStatus || order.status || "pending";
                          const StatusIcon = STATUS_ICON[status] || Clock;
                          const displayTotal = order.totalAmount || 0;
                          return (
                            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                              {/* Header */}
                              <div className="bg-slate-50/80 p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm">
                                <div className="flex flex-wrap gap-6 w-full md:w-auto">
                                  <div>
                                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Order Placed</p>
                                    <p className="text-slate-700 font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Total</p>
                                    <p className="text-slate-700 font-bold">₹{displayTotal.toLocaleString("en-IN")}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Payment</p>
                                    <p className="text-slate-700 font-medium">{order.paymentMethod || "COD"}</p>
                                  </div>
                                  <div className="md:ml-4">
                                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Order ID</p>
                                    <p className="text-slate-700 font-medium">{order.orderNumber || order.orderId || order._id.slice(-8).toUpperCase()}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Body */}
                              <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLOR[status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                                      <StatusIcon className="w-3.5 h-3.5" />
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                  </h3>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="space-y-4 flex-1">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl border border-gray-100 bg-slate-50 overflow-hidden shrink-0">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={item.imageUrl || "/products/ashwagandha.png"} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                                          <p className="text-slate-500 text-xs mt-1">Qty: {item.quantity}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex items-center md:items-end flex-col sm:flex-row gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => window.print()}
                                      className="flex justify-center items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200"
                                    >
                                      <Printer className="w-4 h-4 text-slate-600" />
                                      Print Receipt
                                    </button>
                                    <Link href={`/orders/track?orderId=${order.orderNumber || order.orderId || order._id}`}
                                      className="flex justify-center items-center gap-2 w-full md:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95">
                                      <Truck className="w-4 h-4" />Track Package
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* WISHLIST TAB */}
                  {activeTab === "Wishlist" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-bold text-slate-800 text-lg">Saved Items ({wishlist.length})</h2>
                      </div>
                      {wishlist.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                          <Heart className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                          <p className="font-bold text-slate-700 mb-1">Your wishlist is empty</p>
                          <p className="text-slate-400 text-sm mb-5">Save products you love by clicking the heart icon.</p>
                          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
                            Browse Products
                          </Link>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {wishlist.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-all">
                              <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug mb-1">{item.name}</p>
                                <p className="font-bold text-emerald-700 mb-3">₹{item.price.toLocaleString("en-IN")}</p>
                                <div className="flex gap-2">
                                  <button onClick={() => addToCart(item)}
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">
                                    Add to Cart
                                  </button>
                                  <button onClick={() => toggleWishlist(item)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all">
                                    <Heart className="w-4 h-4 fill-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADDRESSES TAB */}
                  {activeTab === "Addresses" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-bold text-slate-800 text-lg">Saved Addresses</h2>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">
                          + Add New
                        </button>
                      </div>
                      {addresses.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                          <MapPin className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                          <p className="font-bold text-slate-700 mb-1">No saved addresses</p>
                          <p className="text-slate-400 text-sm">Add your delivery address for faster checkout.</p>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {addresses.map((addr) => (
                            <div key={addr._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${addr.isDefault ? "border-emerald-200" : "border-gray-100"}`}>
                              <div className="flex items-start justify-between mb-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${addr.isDefault ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
                                  {addr.label}
                                </span>
                                <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-slate-800 text-sm font-medium">{addr.line1}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{addr.city}, {addr.state} – {addr.pincode}</p>
                              <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{addr.phone}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === "Reviews" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                      <Star className="w-14 h-14 text-amber-200 mx-auto mb-4" />
                      <h3 className="font-bold text-slate-700 mb-1">No reviews yet</h3>
                      <p className="text-slate-400 text-sm mb-5">Share your experience with products you&apos;ve purchased.</p>
                      <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
                        Buy & Review Products
                      </Link>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
