"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Check, X, Trash2, Star, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Review {
  _id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
      } else {
        alert("Failed to update status: " + data.error);
      }
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete review: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "All") return true;
    return r.status === filter;
  });

  const countPending = reviews.filter((r) => r.status === "Pending").length;
  const countApproved = reviews.filter((r) => r.status === "Approved").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Reviews" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-slate-800">Reviews & Ratings Moderation</h1>
          <span className="text-xs bg-slate-100 text-slate-505 text-slate-500 font-bold px-3 py-1 rounded-full">
            {countPending} Reviews Awaiting Action
          </span>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reviews</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{reviews.length}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-500 rounded-2xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Reviews</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{countPending}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-2xl">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved Reviews</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{countApproved}</h3>
              </div>
            </div>
          </div>

          {/* Filters Tab Headers */}
          <div className="flex border-b border-slate-200 mb-6 gap-2">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`pb-3 text-xs font-bold px-4 transition-all relative border-b-2 cursor-pointer ${
                  filter === tab
                    ? "border-emerald-600 text-emerald-650 text-emerald-650 text-emerald-600 font-extrabold"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Reviews Table Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading reviews database...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500">Customer</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500">Product</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500">Rating</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500">Comment</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReviews.map((review) => (
                      <tr key={review._id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-800 text-sm">{review.userName}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{review.userEmail}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-705 text-slate-700 text-xs line-clamp-1">{review.productName}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating ? "fill-current" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-xs text-slate-600 font-semibold leading-normal line-clamp-2">{review.comment}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              review.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : review.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {review.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5 justify-end">
                            {review.status !== "Approved" && (
                              <button
                                onClick={() => handleUpdateStatus(review._id, "Approved")}
                                className="w-8 h-8 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {review.status !== "Rejected" && (
                              <button
                                onClick={() => handleUpdateStatus(review._id, "Rejected")}
                                className="w-8 h-8 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReviews.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                          <p className="font-semibold text-sm">No reviews found matching &quot;{filter}&quot;</p>
                          <p className="text-xs mt-1">New reviews submitted by customers will show up here.</p>
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
