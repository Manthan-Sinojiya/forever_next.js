"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Plus, Trash2, X, Save, Loader2, Tag } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minPurchase: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

const emptyForm = {
  code: "",
  discount: "",
  discountType: "percentage",
  minPurchase: "0",
  description: "",
  expiryDate: "2026-12-31",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCoupon, setNewCoupon] = useState(emptyForm);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCoupon,
          code: newCoupon.code.toUpperCase(),
          discount: parseFloat(newCoupon.discount),
          minPurchase: parseFloat(newCoupon.minPurchase) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([data.data, ...coupons]);
        setIsAdding(false);
        setNewCoupon(emptyForm);
      } else {
        alert("Error adding coupon: " + data.error);
      }
    } catch (err) {
      console.error("Error creating coupon:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Coupons" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-slate-800">Coupons & Offers CMS</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isAdding
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            }`}
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add Coupon"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Add Coupon Form */}
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                Create Promo Coupon
              </h2>
              <form onSubmit={handleAddCoupon} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Coupon Code *</label>
                  <input
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. AYUR50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Coupon Description / Terms *</label>
                  <input
                    required
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    placeholder="e.g. Get 10% OFF on all supplements. Min purchase ₹499"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Discount Value *</label>
                    <input
                      required
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. 10 or 100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Discount Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat (₹)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Min Purchase (₹)</label>
                    <input
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Expiry Date</label>
                    <input
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 shadow-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setNewCoupon(emptyForm); }}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Coupons Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-5 pb-4 border-b border-slate-100">All Coupons ({coupons.length})</h3>
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading coupons...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Tag className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <p className="font-bold text-sm">No coupons found</p>
                <p className="text-xs mt-1">Create one to offer discounts at checkout.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Code</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Discount Details</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Description</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Min Purchase</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Expiry</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-450">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map((coupon) => (
                      <tr key={coupon._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-black text-slate-800 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-700">
                          {coupon.discountType === "percentage" ? `${coupon.discount}%` : `₹${coupon.discount}`}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-semibold max-w-xs truncate">{coupon.description}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-700">₹{coupon.minPurchase}</td>
                        <td className="px-5 py-3.5 text-slate-450">{coupon.expiryDate}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-50 hover:border-red-100"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
