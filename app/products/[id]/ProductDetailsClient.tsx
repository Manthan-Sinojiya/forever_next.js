"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { Star, Heart, ShoppingCart, Minus, Plus, ShieldCheck, Truck, RefreshCw, Send, Check } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  todayDeal?: boolean;
  originalPrice?: number;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Reviews States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  // Cart / Wishlist States from Zustand
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist || []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchReviews();
    if (session?.user) {
      setReviewerName(session.user.name || "");
      setReviewerEmail(session.user.email || "");
    }
  }, [session]);

  if (!mounted) return null;

  const cartItem = cart.find((item) => item._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);

  // Calculate Average Rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : (product.rating || 5.0).toFixed(1);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !reviewerName.trim() || !reviewerEmail.trim()) {
      setReviewError("Please fill out all fields.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: reviewerName,
          userEmail: reviewerEmail,
          rating: ratingInput,
          comment: commentInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess("Thank you! Your review has been submitted and is awaiting admin approval.");
        setCommentInput("");
        if (!session?.user) {
          setReviewerName("");
          setReviewerEmail("");
        }
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setReviewError("An error occurred. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  const discountPercent = originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-50/50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group overflow-hidden">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                Save {discountPercent}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-all cursor-pointer ${
                isInWishlist
                  ? "bg-red-55 border-red-100 bg-red-50 text-red-500"
                  : "bg-white border-slate-100 text-slate-400 hover:text-red-500"
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 transition-transform duration-300 group-hover:scale-105">
              <img
                src={product.imageUrl || "/logo/logo.png"}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md w-fit mb-4">
              {product.category}
            </span>
            <h1 className="font-heading font-black text-2xl lg:text-3xl text-slate-800 mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(averageRating)) ? "fill-current" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{averageRating}</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-semibold">{reviews.length} Verified Customer Reviews</span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="text-3xl font-black text-slate-900 font-heading">₹{product.price.toFixed(2)}</span>
              <span className="text-sm text-slate-450 line-through text-slate-400 font-semibold">
                ₹{originalPrice.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
              {product.description || "Premium certified product sourced directly from natural, authentic manufacturers. Tested for quality and potency to support healthy lifestyles."}
            </p>

            {/* Inventory Status */}
            <div className="mb-8">
              <p className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Availability</p>
              {product.inStock ? (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              ) : (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart Controls */}
            <div className="mt-auto">
              {product.inStock && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {cartQty === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden max-w-sm">
                      <button
                        onClick={() => updateQuantity(product._id, cartQty - 1)}
                        className="px-4 py-3.5 hover:bg-slate-200 text-slate-600 font-black transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center font-bold text-slate-800 text-sm">
                        {cartQty} <span className="text-xs text-slate-400 font-medium ml-1">in cart</span>
                      </div>
                      <button
                        onClick={() => updateQuantity(product._id, cartQty + 1)}
                        className="px-4 py-3.5 hover:bg-slate-200 text-slate-600 font-black transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery/Warranty info */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">100% Genuine Brands</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">Easy 7-Day Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Reviews List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
            <h3 className="font-heading font-black text-xl text-slate-805 text-slate-800 mb-6 pb-4 border-b border-slate-100">
              Customer Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm font-semibold">No reviews yet for this product.</p>
                <p className="text-xs mt-1">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <div key={review._id} className="pb-6 border-b border-slate-105 border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-extrabold text-slate-800">{review.userName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "fill-current" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Write a Review Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
            <h3 className="font-heading font-black text-xl text-slate-800 mb-6 pb-4 border-b border-slate-100">
              Share Your Experience
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRatingInput(stars)}
                      className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          stars <= ratingInput ? "fill-current" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-650 text-slate-500 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    disabled={!!session?.user}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600/30 text-xs font-semibold disabled:opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-650 text-slate-500 uppercase tracking-wider mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    disabled={!!session?.user}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600/30 text-xs font-semibold disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Comments textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-650 text-slate-500 uppercase tracking-wider mb-1">
                  Review Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell us what you liked or disliked about this product..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600/30 text-xs font-semibold resize-none"
                />
              </div>

              {reviewError && <p className="text-xs text-red-500 font-bold">{reviewError}</p>}
              {reviewSuccess && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl">{reviewSuccess}</p>}

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}
