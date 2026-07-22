"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Package, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CustomerDetailsClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  
  const customer = initialData;
  const orders = initialData.orders || [];

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
            Back to Customers
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Customer Details
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Details */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <div className="flex flex-col items-center text-center mb-6 border-b border-slate-100 pb-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl uppercase mb-4">
                {customer.name ? customer.name.charAt(0) : <User className="w-10 h-10" />}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{customer.name || "Guest User"}</h2>
              <p className="text-slate-500 text-sm mt-1">ID: #{customer._id?.slice(-6).toUpperCase()}</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Customer
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 font-medium">{customer.email || "No Email provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 font-medium">{customer.phone || "No Phone provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 font-medium">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" /> Order History ({orders.length})
            </h3>
            
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-l-lg">Order ID</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Total</th>
                      <th className="px-4 py-3 font-semibold rounded-r-lg"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                            {order.orderStatus || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-900">
                          ₹{(order.total || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link href={`/admin/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No orders found for this customer.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
