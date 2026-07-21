"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package, CheckCircle2, Truck, MapPin, Download,
  Clock, Search, ArrowRight, Home, ShoppingBag
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUSES = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const STATUS_ICONS = [
  <CheckCircle2 key="confirmed" className="w-5 h-5" />,
  <Package key="packed" className="w-5 h-5" />,
  <Truck key="shipped" className="w-5 h-5" />,
  <MapPin key="ofd" className="w-5 h-5" />,
  <Home key="delivered" className="w-5 h-5" />,
];

const STATUS_DATES: Record<string, string[]> = {
  confirmed: ["Jul 15, 2025", "10:32 AM"],
  packed: ["Jul 15, 2025", "03:45 PM"],
  shipped: ["Jul 16, 2025", "09:10 AM"],
  "out for delivery": ["Jul 17, 2025", "08:00 AM"],
  delivered: ["Jul 17, 2025", "02:30 PM"],
};

const STATUS_NOTES: Record<string, string> = {
  confirmed: "Your order has been confirmed and is being processed.",
  packed: "Your items are packed and ready for dispatch.",
  shipped: "Your order has been shipped via Blue Dart (AWB: BD12345678).",
  "out for delivery": "Your order is out for delivery. Expect delivery by 6 PM today.",
  delivered: "Your order was successfully delivered.",
};

interface MockOrder {
  orderId: string;
  status: string;
  customer: string;
  address: string;
  products: Array<{ name: string; qty: number; price: number; image: string }>;
  total: number;
  payment: string;
  estimatedDelivery: string;
}

const MOCK_ORDER: MockOrder = {
  orderId: "FHC-2025-00142",
  status: "Out for Delivery",
  customer: "Rahul Sharma",
  address: "24, Palm Grove, Andheri West, Mumbai – 400058",
  products: [
    { name: "Ashwagandha Root Extract (60 Capsules)", qty: 2, price: 599, image: "/products/ashwagandha.png" },
    { name: "Organic Turmeric Curcumin 500mg", qty: 1, price: 349, image: "/products/vitamin-c-zinc.png" },
  ],
  total: 1547,
  payment: "Paid via Razorpay (UPI)",
  estimatedDelivery: "Jul 17, 2025 by 6:00 PM",
};

export default function OrderTrackingPage() {
  const [trackId, setTrackId] = useState("");
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const currentStep = STATUSES.findIndex(
    (s) => s.toLowerCase() === (order?.status || "").toLowerCase()
  );

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(trackId.trim())}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const addr = d.shippingAddress || {};
        setOrder({
          orderId: d.orderId || d._id.slice(-8).toUpperCase(),
          status: d.status || "Processing",
          customer: addr.fullName || d.email || "Customer",
          address: `${addr.line1 || addr.street || ""}, ${addr.city || ""} - ${addr.pincode || ""}`,
          products: (d.items || []).map((i: any) => ({
            name: i.name,
            qty: i.quantity || 1,
            price: i.price,
            image: i.imageUrl || "/products/ashwagandha.png"
          })),
          total: d.totalAmount || d.total || 0,
          payment: d.paymentMethod || "Prepaid",
          estimatedDelivery: "Standard Delivery (3-5 business days)",
        });
      } else {
        if (trackId.trim().toLowerCase() === "fhc-2025-00142" || trackId.trim().toLowerCase() === "demo") {
          setOrder(MOCK_ORDER);
        } else {
          setNotFound(true);
        }
      }
    } catch (err) {
      if (trackId.trim().toLowerCase() === "fhc-2025-00142" || trackId.trim().toLowerCase() === "demo") {
        setOrder(MOCK_ORDER);
      } else {
        setNotFound(true);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Track Your Order</h1>
              <p className="text-white/80 max-w-xl mx-auto text-sm">
                Enter your Order ID to get real-time delivery updates
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="font-heading font-bold text-slate-800 text-lg mb-1">Enter Order ID</h2>
            <p className="text-slate-500 text-xs mb-4">Try <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => setTrackId("FHC-2025-00142")}>FHC-2025-00142</span> or <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => setTrackId("demo")}>demo</span> for a demo.</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  placeholder="e.g. FHC-2025-00142"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 text-sm font-medium outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button onClick={handleTrack} disabled={loading}
                className="px-6 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2 shadow-md">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <ArrowRight className="w-4 h-4" />}
                {loading ? "Tracking..." : "Track"}
              </button>
            </div>

            {notFound && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                ❌ Order not found. Please check your Order ID and try again.
              </motion.div>
            )}
          </motion.div>

          {/* Order Details */}
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">ORDER ID</p>
                    <h3 className="font-heading font-bold text-slate-800 text-lg">{order.orderId}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                      <Clock className="w-3.5 h-3.5" />
                      {order.status}
                    </span>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-all">
                      <Download className="w-3.5 h-3.5" />
                      Download Invoice
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wide">Customer</p>
                    <p className="font-bold text-slate-800">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wide">Est. Delivery</p>
                    <p className="font-bold text-emerald-700">{order.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wide">Payment</p>
                    <p className="font-bold text-slate-800">{order.payment}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <h3 className="font-heading font-bold text-slate-800 mb-6">Shipment Timeline</h3>
                <div className="space-y-0">
                  {STATUSES.map((status, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    const key = status.toLowerCase();
                    return (
                      <div key={status} className="flex gap-4">
                        {/* Connector */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCurrent
                                ? "bg-gradient-to-br from-[#1E5AA8] to-[#43B97F] text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-100"
                                : isCompleted
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {STATUS_ICONS[index]}
                          </motion.div>
                          {index < STATUSES.length - 1 && (
                            <div className={`w-0.5 h-12 transition-all ${isCompleted ? "bg-emerald-400" : "bg-slate-100"}`} />
                          )}
                        </div>
                        {/* Content */}
                        <div className={`pb-8 ${index === STATUSES.length - 1 ? "pb-0" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-bold text-sm ${isCurrent ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
                              {status}
                            </p>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Current</span>
                            )}
                          </div>
                          {isCompleted && STATUS_DATES[key] && (
                            <p className="text-xs text-slate-500 font-medium mb-1">
                              {STATUS_DATES[key][0]} · {STATUS_DATES[key][1]}
                            </p>
                          )}
                          {isCompleted && STATUS_NOTES[key] && (
                            <p className={`text-xs ${isCurrent ? "text-slate-600" : "text-slate-400"}`}>
                              {STATUS_NOTES[key]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <h3 className="font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Delivery Address
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="font-bold text-slate-800 text-sm">{order.customer}</p>
                  <p className="text-slate-500 text-sm mt-1">{order.address}</p>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <h3 className="font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Items Ordered
                </h3>
                <div className="space-y-3">
                  {order.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-slate-800 text-sm whitespace-nowrap">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Total Amount</span>
                  <span className="font-bold text-emerald-700 text-lg">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Help */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl p-6 border border-blue-100/50 text-center">
                <p className="font-bold text-slate-800 mb-1">Need Help?</p>
                <p className="text-slate-500 text-sm mb-4">Our support team is here to assist you.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/contact" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    Contact Support
                  </Link>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-bold hover:bg-[#1ebe5d] transition-all">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
