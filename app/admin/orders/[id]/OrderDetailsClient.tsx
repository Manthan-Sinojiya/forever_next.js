"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin/orders";
import { Save, Printer, Truck, Package, ArrowLeft, Clock, CheckCircle2, User, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderDetailsClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(initialData.orderStatus || "Pending");
  const [paymentStatus, setPaymentStatus] = useState(initialData.paymentStatus || "Unpaid");
  const [trackingNumber, setTrackingNumber] = useState(initialData.trackingNumber || "");

  const handleUpdate = async () => {
    setIsSubmitting(true);
    await updateOrderStatus(initialData._id, { 
      orderStatus: status,
      paymentStatus,
      trackingNumber
    });
    setIsSubmitting(false);
    router.refresh();
  };

  const statusColors: Record<string, { bg: string; text: string; dot: string; icon: any }> = {
    "Pending": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: Clock },
    "Processing": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: Package },
    "Shipped": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", icon: Truck },
    "Delivered": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
    "Cancelled": { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", icon: CheckCircle2 },
    "Refunded": { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500", icon: CheckCircle2 },
  };

  const currentStatusStyle = statusColors[status] || statusColors["Pending"];
  const StatusIcon = currentStatusStyle.icon;

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Order #{initialData.orderNumber || initialData._id.substring(initialData._id.length - 8).toUpperCase()}
            </h1>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border border-transparent ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
              <StatusIcon className="w-4 h-4" />
              {status}
            </div>
          </div>
          <p className="text-slate-500">Placed on {new Date(initialData.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> 
            Print Invoice
          </button>
          <button 
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-70 transition-all"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" /> Items Ordered
            </h3>
            <div className="space-y-4">
              {initialData.items?.length > 0 ? initialData.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                      {item.image ? <img src={item.image} alt="product" className="w-full h-full object-cover" /> : <Package className="w-6 h-6"/>}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.name || "Product Name"}</p>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Qty: {item.quantity || 1} <span className="text-slate-300 mx-1">×</span> ₹{item.price || 0}</p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    ₹{((item.quantity || 1) * (item.price || 0)).toLocaleString()}
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No items found.</p>
                </div>
              )}
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="w-full sm:w-1/2 ml-auto space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{(initialData.subtotal || initialData.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Shipping</span>
                  <span className="text-slate-900">₹{(initialData.shippingFee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Tax</span>
                  <span className="text-slate-900">₹{(initialData.tax || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-lg pt-4 border-t border-slate-200 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{(initialData.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Order Timeline
            </h3>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 mt-4">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-1 ring-slate-200"></div>
                <p className="text-sm font-bold text-slate-900">Order Placed</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{new Date(initialData.createdAt).toLocaleString()}</p>
              </div>

              <div className={`relative pl-6 transition-all duration-300 ${(status === "Processing" || status === "Shipped" || status === "Delivered") ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-200 ${(status === "Processing" || status === "Shipped" || status === "Delivered") ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                <p className="text-sm font-bold text-slate-900">Processing</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Payment verified, order is being prepared.</p>
              </div>

              <div className={`relative pl-6 transition-all duration-300 ${(status === "Shipped" || status === "Delivered") ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-200 ${(status === "Shipped" || status === "Delivered") ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                <p className="text-sm font-bold text-slate-900">Shipped</p>
                {trackingNumber ? (
                  <p className="text-xs font-medium text-slate-500 mt-1">Tracking ID: <span className="text-indigo-600 font-semibold">{trackingNumber}</span></p>
                ) : (
                  <p className="text-xs font-medium text-slate-500 mt-1">Awaiting tracking details.</p>
                )}
              </div>

              <div className={`relative pl-6 transition-all duration-300 ${status === "Delivered" ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-200 ${status === "Delivered" ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <p className="text-sm font-bold text-slate-900">Delivered</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Package has arrived at destination.</p>
              </div>
              
            </div>
          </motion.div>

        </div>

        {/* Right Column - Status & Customer Details */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Fulfillment</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all cursor-pointer text-slate-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
                <select 
                  value={paymentStatus} 
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all cursor-pointer text-slate-900"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Number</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="AWB or Link"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Customer</h3>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{initialData.customerName || "Guest User"}</p>
                <p className="text-sm font-medium text-slate-500 mt-0.5 break-all">{initialData.customerEmail || "No Email"}</p>
                <p className="text-sm font-medium text-slate-500 mt-0.5">{initialData.customerPhone || "No Phone"}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </h4>
              {initialData.shippingAddress ? (
                <div className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                  <p>{initialData.shippingAddress.addressLine1}</p>
                  <p>{initialData.shippingAddress.city}, {initialData.shippingAddress.state}</p>
                  <p>{initialData.shippingAddress.pincode}</p>
                  <p>{initialData.shippingAddress.country || 'India'}</p>
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                  No address provided.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
