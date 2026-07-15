"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect, Suspense } from "react";
import { useCartStore } from "@/lib/store";
import {
  Package,
  Heart,
  RotateCw,
  Gift,
  Tag,
  TrendingUp,
  Award,
  User,
  Zap,
  Check,
  Copy,
  ShoppingCart,
  Trash2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Dispatched" | "Delivered" | "Cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: string;
  minPurchase: number;
  description: string;
  expiryDate: string;
}

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "Profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Profile data
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("user");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // Return request form state
  const [returnOrderId, setReturnOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnSuccess, setReturnSuccess] = useState(false);

  // Cart/Wishlist store
  const wishlist = useCartStore((state) => state.wishlist || []);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  // Sync tab from URL params if changed
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Load orders
  const loadOrders = async (userEmail?: string) => {
    setLoadingOrders(true);
    const targetEmail = userEmail || email;
    if (!targetEmail) {
      setLoadingOrders(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load coupons
  const loadCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error("Error loading coupons:", err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const loadProfile = async (userEmail: string) => {
    try {
      const res = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setName(data.data.name);
        setEmail(data.data.email);
        setPhone(data.data.phone);
        setCity(data.data.city);
        setState(data.data.state);
        setRole(data.data.role);
        // Sync local storage in case details were changed
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("userRole", data.data.role);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    
    if (savedEmail) {
      setEmail(savedEmail);
      loadProfile(savedEmail);
      loadOrders(savedEmail);
    } else {
      router.push("/login");
    }
    loadCoupons();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, city, state }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("userName", data.data.name);
        window.dispatchEvent(new Event("storage"));
      } else {
        alert("Failed to update profile: " + data.error);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully");
        loadOrders();
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId || !returnReason) return;
    setReturnSuccess(true);
    setTimeout(() => {
      setReturnSuccess(false);
      setReturnOrderId("");
      setReturnReason("");
      alert("Return request submitted successfully! A pickup will be scheduled shortly.");
    }, 1500);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Navigation Options
  const tabOptions = [
    { name: "Profile", icon: <User className="w-4 h-4" />, label: "My Profile" },
    { name: "Orders", icon: <Package className="w-4 h-4" />, label: "My Orders" },
    { name: "Deals", icon: <Zap className="w-4 h-4 text-amber-550 text-amber-500" />, label: "Today's Deals" },
    { name: "Wishlist", icon: <Heart className="w-4 h-4" />, label: "Wishlist" },
    { name: "Returns", icon: <RotateCw className="w-4 h-4" />, label: "Easy Returns" },
    { name: "GiftCards", icon: <Gift className="w-4 h-4" />, label: "Gift Cards" },
    { name: "Coupons", icon: <Tag className="w-4 h-4" />, label: "Coupons" },
    { name: "Offers", icon: <TrendingUp className="w-4 h-4" />, label: "Top Offers" },
    { name: "Rewards", icon: <Award className="w-4 h-4" />, label: "Rewards" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-slate-50 min-h-screen">
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold font-heading text-slate-800">
                Welcome, <span className="text-emerald-600">{name}</span>
              </h1>
              <p className="text-slate-500 text-sm font-semibold mt-1">
                Manage your orders, profile details, rewards, and exclusive coupons.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
              <Award className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rewards Tier</p>
                <p className="text-sm font-extrabold text-slate-800">Gold Member (350 Pts)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="pb-12 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* Sidebar Menu */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
                  <div className="flex items-center gap-3 p-3 border-b border-slate-100 mb-4 pb-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                      {name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 leading-snug">{name}</h4>
                      <p className="text-xs font-medium text-slate-400">{email}</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {tabOptions.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => setActiveTab(opt.name)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                          activeTab === opt.name
                            ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left text-emerald-600 hover:bg-emerald-50 border-l-4 border-transparent"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </nav>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm min-h-[480px]">
                  
                  {/* ── PROFILE TAB ── */}
                  {activeTab === "Profile" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Personal Information</h3>
                      <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-650/30 focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-550/10 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                              type="email"
                              value={email}
                              disabled
                              className="w-full px-4 py-3 rounded-xl bg-slate-150 bg-slate-100 border border-transparent text-slate-400 outline-none text-sm font-medium cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State</label>
                            <input
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all"
                          >
                            {saving ? "Saving Changes..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* ── ORDERS TAB ── */}
                  {activeTab === "Orders" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Order History</h3>
                      {loadingOrders ? (
                        <div className="text-center py-10">Loading orders...</div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="font-bold text-sm">No orders found</p>
                          <p className="text-xs mt-1">Start shopping to fill your order log.</p>
                          <Link href="/products" className="text-emerald-600 hover:underline text-xs font-bold mt-3 inline-block">Shop Products →</Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order._id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                              {/* Order Header */}
                              <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 border-slate-100 flex flex-wrap justify-between items-center gap-2">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Number</span>
                                  <span className="font-mono font-extrabold text-sm text-slate-800">{order.orderNumber}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Placed</span>
                                  <span className="font-bold text-xs text-slate-600">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    order.status === "Pending" ? "bg-amber-100 text-amber-800" :
                                    order.status === "Dispatched" ? "bg-blue-100 text-blue-800" :
                                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
                                  <span className="font-black text-sm text-emerald-600">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                              
                              {/* Order Items */}
                              <div className="p-5 divide-y divide-slate-100">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-center py-3 first:pt-0 last:pb-0">
                                    <div className="relative w-12 h-12 bg-slate-50 border border-slate-200 rounded overflow-hidden flex-shrink-0">
                                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-bold text-xs text-slate-800 truncate">{item.name}</h5>
                                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Cancel Button */}
                              {order.status === "Pending" && (
                                <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                  <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-650 hover:bg-red-50 px-3.5 py-1.5 rounded-lg border border-red-100 transition-colors"
                                  >
                                    Cancel Order
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TODAY'S DEALS TAB ── */}
                  {activeTab === "Deals" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Today&apos;s Deals</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { name: "Pure Ashwagandha Extract 500mg", price: 399, original: 999, image: "https://picsum.photos/seed/ashwa/800/800", save: "60% OFF" },
                          { name: "Fingertip Pulse Oximeter", price: 599, original: 1199, image: "https://picsum.photos/seed/oxi/800/800", save: "50% OFF" },
                        ].map((d, i) => (
                          <div key={i} className="border border-slate-100 rounded-2xl p-4 flex gap-3 items-center hover:shadow-md transition-shadow relative">
                            <div className="absolute top-2 left-2 bg-red-650 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded z-10">{d.save}</div>
                            <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                              <Image src={d.image} alt={d.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-slate-800 truncate">{d.name}</h4>
                              <div className="flex items-baseline gap-1.5 mt-1">
                                <span className="font-black text-sm text-slate-900">₹{d.price}</span>
                                <span className="text-[10px] text-slate-400 line-through">₹{d.original}</span>
                              </div>
                              <button
                                onClick={() => addToCart({ _id: `deal-tab-${i}`, name: d.name, price: d.price, imageUrl: d.image, inStock: true } as any)}
                                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md mt-2 transition-colors flex items-center gap-1 w-max"
                              >
                                <ShoppingCart className="w-3 h-3" /> Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── WISHLIST TAB ── */}
                  {activeTab === "Wishlist" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">My Wishlist</h3>
                      {wishlist.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="font-bold text-sm">Your wishlist is empty</p>
                          <p className="text-xs mt-1">Save products you love to track them.</p>
                          <Link href="/products" className="text-emerald-600 hover:underline text-xs font-bold mt-3 inline-block">Browse Products →</Link>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {wishlist.map((item) => (
                            <div key={item._id} className="border border-slate-100 rounded-2xl p-4 flex gap-4 items-center bg-white shadow-sm hover:shadow-md transition-shadow relative">
                              <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-slate-800 truncate">{item.name}</h4>
                                <p className="font-black text-sm text-emerald-650 text-emerald-600 mt-1">₹{item.price.toFixed(2)}</p>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      addToCart(item);
                                      toggleWishlist(item);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                  >
                                    <ShoppingCart className="w-3 h-3" /> Cart
                                  </button>
                                  <button
                                    onClick={() => toggleWishlist(item)}
                                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-colors"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── RETURNS TAB ── */}
                  {activeTab === "Returns" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Easy Returns Panel</h3>
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 mb-6">
                        <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-xs text-emerald-800">10-Day Free & Easy Returns</h5>
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">We offer hassle-free return pickups at your shipping address within 10 days of delivery. Keep tags intact.</p>
                        </div>
                      </div>

                      <form onSubmit={handleReturnSubmit} className="space-y-4 max-w-lg">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Order</label>
                          <select
                            value={returnOrderId}
                            onChange={(e) => setReturnOrderId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                            required
                          >
                            <option value="">-- Select Delivered Order --</option>
                            {orders.length > 0 ? (
                              orders.map(o => (
                                <option key={o._id} value={o.orderNumber}>
                                  {o.orderNumber} (₹{o.totalAmount})
                                </option>
                              ))
                            ) : (
                              <option value="demo-1">ORD-775489 (₹470.82)</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Reason for Return</label>
                          <textarea
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            rows={3}
                            placeholder="Please specify why you are returning the product..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                        >
                          Request Return Pickup
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ── GIFT CARDS TAB ── */}
                  {activeTab === "GiftCards" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Gift Cards</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-44">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-6 -mt-6" />
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold">Forever Healthcare Gift Card</p>
                              <h4 className="font-extrabold text-sm mt-1">ACTIVE CARD</h4>
                            </div>
                            <Gift className="w-6 h-6 text-emerald-200" />
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-200">Balance</p>
                            <h2 className="text-3xl font-black">₹1,500.00</h2>
                          </div>
                        </div>

                        <div className="border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">Add Gift Card to Wallet</h4>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Enter code & pin to claim gift voucher value.</p>
                          </div>
                          <div className="space-y-3 mt-3">
                            <input
                              type="text"
                              placeholder="Voucher Code"
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600/30"
                            />
                            <button
                              onClick={() => alert("Gift Card added to your wallet successfully!")}
                              className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition-all"
                            >
                              Redeem Card
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── COUPONS TAB ── */}
                  {activeTab === "Coupons" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">My Coupons</h3>
                      {loadingCoupons ? (
                        <div>Loading coupons...</div>
                      ) : coupons.length === 0 ? (
                        <div className="text-slate-400 text-sm">No active coupons available at this time.</div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {coupons.map((c) => (
                            <div key={c._id} className="border border-dashed border-emerald-250 border-emerald-250 border-emerald-200 rounded-2xl p-4 bg-emerald-50/20 flex justify-between items-center">
                              <div>
                                <span className="font-mono font-black text-slate-800 tracking-wider text-sm bg-white px-2 py-0.5 rounded border border-emerald-100">{c.code}</span>
                                <p className="text-[11px] text-slate-500 font-medium mt-2">{c.description}</p>
                              </div>
                              <button
                                onClick={() => copyCoupon(c.code)}
                                className="p-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-600 transition-all"
                              >
                                {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TOP OFFERS TAB ── */}
                  {activeTab === "Offers" && (
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Top Offers</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Buy 1 Get 1 Free on Aloe Vera Gels", code: "ALOE1", desc: "Add two Aloe Vera gels to cart and apply coupon at checkout." },
                          { title: "Flat 40% Off on BP Monitors", code: "MONITOR40", desc: "Select health equipment on discount today." },
                        ].map((offer, index) => (
                          <div key={index} className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div>
                              <h5 className="font-bold text-sm text-slate-800">{offer.title}</h5>
                              <p className="text-xs text-slate-400 font-semibold mt-0.5">{offer.desc}</p>
                            </div>
                            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl text-xs">{offer.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── REWARDS TAB ── */}
                  {activeTab === "Rewards" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-extrabold font-heading text-slate-800 mb-6 pb-3 border-b border-slate-100">Loyalty Rewards Points</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                            <Award className="w-8 h-8 text-emerald-655 text-emerald-600 mx-auto mb-2" />
                            <h4 className="font-bold text-sm text-slate-800">Total Points</h4>
                            <p className="text-2xl font-black text-emerald-600 mt-1">350 Pts</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                            <RotateCw className="w-8 h-8 text-slate-655 text-slate-500 mx-auto mb-2" />
                            <h4 className="font-bold text-sm text-slate-800">Pending points</h4>
                            <p className="text-2xl font-black text-slate-600 mt-1">45 Pts</p>
                          </div>
                          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
                            <TrendingUp className="w-8 h-8 text-amber-555 text-amber-500 mx-auto mb-2" />
                            <h4 className="font-bold text-sm text-slate-800">Level Progression</h4>
                            <p className="text-xs font-bold text-amber-600 mt-2">80% to Platinum</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border border-slate-150 border-slate-100 rounded-3xl bg-slate-50/50">
                        <h4 className="font-bold text-sm text-slate-800">Refer & Earn Bonus Points</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-1">Share your referral link with friends. They get ₹100 flat off first orders and you get 50 Reward points!</p>
                        <div className="flex gap-2 mt-4 max-w-sm">
                          <input
                            type="text"
                            value="https://foreverhealthcare.in/ref/johndoe77"
                            disabled
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs flex-1 text-slate-500 outline-none"
                          />
                          <button
                            onClick={() => alert("Referral link copied!")}
                            className="bg-slate-900 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
