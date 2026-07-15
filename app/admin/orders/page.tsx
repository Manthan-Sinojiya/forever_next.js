"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Package, Clock, CheckCircle2, Truck, Trash2, Search, Loader2 } from "lucide-react";

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
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Dispatched" | "Delivered" | "Cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
      } else {
        alert("Failed to update status: " + data.error);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order record?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o._id !== orderId));
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    dispatched: orders.filter(o => o.status === "Dispatched").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Orders" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-slate-800">Manage Orders</h1>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
            {stats.total} Orders in DB
          </span>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Stats Summary Card */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Sales Orders", value: stats.total, color: "text-slate-800", bg: "bg-slate-50" },
              { label: "Pending COD", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Dispatched", value: stats.dispatched, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Delivered Successfully", value: stats.delivered, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-400 font-semibold mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 w-full outline-none text-sm focus:border-emerald-600/30 transition-colors"
            />
          </div>

          {/* Orders Table container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Order ID</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Customer Details</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Items count</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">COD Amount</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Status</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-extrabold text-slate-800">{order.orderNumber}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-850 text-slate-800">{order.shippingAddress.fullName}</div>
                          <div className="text-[11px] text-slate-400">{order.userEmail} | {order.shippingAddress.phone}</div>
                          <div className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-xs">{order.shippingAddress.addressLine}, {order.shippingAddress.city}</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-500">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </td>
                        <td className="px-5 py-3.5 font-black text-slate-800">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          {updatingId === order._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider outline-none border border-transparent ${
                                order.status === "Pending" ? "bg-amber-100 text-amber-800" :
                                order.status === "Dispatched" ? "bg-blue-100 text-blue-800" :
                                order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                                "bg-red-100 text-red-800"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                            title="Delete Order Log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                          <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                          <p className="font-bold">No orders found.</p>
                          <p className="text-xs mt-1">Order logs placed from checkout show up here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
