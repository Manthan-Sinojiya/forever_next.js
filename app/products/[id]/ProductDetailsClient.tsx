"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { 
  Star, 
  ShoppingCart, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Send, 
  Check, 
  Award, 
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";

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
  sizes?: Array<{ name: string; price: number; originalPrice?: number }>;
  imageGallery?: string[];
  highlights?: string[];
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  whoShouldUse?: string;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function getHoverImageUrl(product: Product): string {
  const url = product.imageUrl || "";

  // Local static product images mapping
  if (url.includes("ashwagandha.png")) return "/products/vitality-capsules.png";
  if (url.includes("vitamin-c-zinc.png")) return "/products/ashwagandha.png";
  if (url.includes("bp-monitor.png")) return "/products/glucose-meter.png";
  if (url.includes("pulse-oximeter.png")) return "/products/thermometer.png";
  if (url.includes("vitality-capsules.png")) return "/products/ashwagandha.png";
  if (url.includes("glucose-meter.png")) return "/products/bp-monitor.png";
  if (url.includes("knee-support.png")) return "/products/bp-monitor.png";
  if (url.includes("thermometer.png")) return "/products/pulse-oximeter.png";
  if (url.includes("first-aid.png")) return "/products/vitamin-c-zinc.png";

  // Unsplash images mapping
  if (url.includes("unsplash.com")) {
    const hoverOptions = [
      "photo-1584017911766-d451b3d0e843", // pill capsules
      "photo-1584308647960-ef37f7798656", // medicine box
      "photo-1607619056574-7b8d304f3c6f", // pills pack
      "photo-1628771065518-0d82f1938462", // supplements bottle
    ];
    
    const key = product._id || product.name || "";
    const charSum = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chosenPhotoId = hoverOptions[charSum % hoverOptions.length];

    const match = url.match(/photo-[a-zA-Z0-9-]+/);
    if (match) {
      return url.replace(match[0], chosenPhotoId);
    }
  }

  return "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop";
}

function getCategoryDetails(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("supplement")) {
    return {
      benefits: [
        { title: "Complete Health Insights", desc: "Helps you maintain balanced nutritional intake effortlessly." },
        { title: "Track Fitness Goals", desc: "Supports cell recovery, daily stamina, and stamina thresholds." },
        { title: "Motivation for Healthy Living", desc: "Clean ingredients encourage proactive daily health habits." },
        { title: "Suitable for the Whole Family", desc: "Formulated safely to meet wellness requirements for adults of all ages." },
        { title: "Convenient Home Monitoring", desc: "Easy-to-use capsules that fit seamlessly into busy lifestyles." }
      ],
      usage: "Take 1-2 capsules daily after meals with water, or as recommended by your physician. Do not exceed the recommended daily dosage."
    };
  }
  if (cat.includes("equipment") || cat.includes("device")) {
    return {
      benefits: [
        { title: "Complete Health Insights", desc: "Helps you understand your body composition beyond just weight." },
        { title: "Track Fitness Goals", desc: "Monitor progress in fat loss, muscle gain, and overall health improvements." },
        { title: "Motivation for Healthy Living", desc: "Real-time data encourages better lifestyle and fitness decisions." },
        { title: "Suitable for the Whole Family", desc: "Can be used by multiple users with individual data tracking." },
        { title: "Convenient Home Monitoring", desc: "Reduces the need for frequent clinic visits for basic health tracking." }
      ],
      usage: "Ensure you are rested. Wrap the cuff snugly around your upper arm at heart level, sit upright, and press the power button to start measurement."
    };
  }
  if (cat.includes("men")) {
    return {
      benefits: [
        { title: "Complete Health Insights", desc: "Targets specific physical vitality pathways for active performance." },
        { title: "Track Fitness Goals", desc: "Speeds up muscle building, test levels, and athletic response rates." },
        { title: "Motivation for Healthy Living", desc: "Keeps physical drive and recovery energy consistently elevated." },
        { title: "Suitable for the Whole Family", desc: "Safe, natural botanical formula engineered for adult men." },
        { title: "Convenient Home Monitoring", desc: "Easy capsules that integrate directly into your pre/post workout stacks." }
      ],
      usage: "Take 1 capsule twice daily with milk or warm water, preferably after meals. Consistent use for 6-8 weeks is recommended for optimal results."
    };
  }
  if (cat.includes("care") || cat.includes("skin") || cat.includes("personal")) {
    return {
      benefits: [
        { title: "Complete Health Insights", desc: "Moisturizes deep epidermis cells to improve daily complexion." },
        { title: "Track Fitness Goals", desc: "Restores cellular hydration levels and tightens skin texture." },
        { title: "Motivation for Healthy Living", desc: "Keeps skin radiant, organic, and shielded from urban pollution." },
        { title: "Suitable for the Whole Family", desc: "Dermatologically tested formula safe for all skin types." },
        { title: "Convenient Home Monitoring", desc: "Clean application bottles that simplify skin routines." }
      ],
      usage: "Apply 3-5 drops to clean, dry skin on the face and neck. Gently tap and massage in upward circular motions. Best used morning and night."
    };
  }
  return {
    benefits: [
      { title: "Complete Health Insights", desc: "Provides verified support for daily health maintenance." },
      { title: "Track Fitness Goals", desc: "Sustains physical vigor and metabolic balances throughout the day." },
      { title: "Motivation for Healthy Living", desc: "Standardized active components ensure consistency and efficacy." },
      { title: "Suitable for the Whole Family", desc: "Carefully filtered to be safe and chemical-free." },
      { title: "Convenient Home Monitoring", desc: "Provides high-grade professional quality right in your home." }
    ],
    usage: "Consume as instructed on the product container or as directed by a qualified healthcare practitioner."
  };
}

function getCategorySizes(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("supplement")) return ["60 Tablets", "120 Tablets", "180 Tablets"];
  if (cat.includes("equipment") || cat.includes("device")) return ["Standard Unit", "Family Pack Pro"];
  if (cat.includes("care") || cat.includes("skin") || cat.includes("personal")) return ["100ml", "200ml", "500ml"];
  return ["200g", "500ml", "60 Tablets"];
}

function getCategoryColorTheme(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("supplement")) return { glow: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-100", bg: "bg-emerald-50 text-emerald-700" };
  if (cat.includes("equipment")) return { glow: "from-blue-500/20 to-cyan-500/10", border: "border-blue-100", bg: "bg-blue-50 text-blue-700" };
  if (cat.includes("men")) return { glow: "from-amber-500/20 to-orange-500/10", border: "border-amber-100", bg: "bg-amber-50 text-amber-700" };
  if (cat.includes("care")) return { glow: "from-pink-500/20 to-purple-500/10", border: "border-pink-100", bg: "bg-pink-50 text-pink-700" };
  return { glow: "from-slate-500/20 to-slate-400/10", border: "border-slate-100", bg: "bg-slate-50 text-slate-700" };
}

function getProductSKU(product: Product) {
  const code = product._id ? product._id.substring(18).toUpperCase() : "9876";
  return `9876${code}`;
}

function getRichDescription(product: Product) {
  const cat = (product.category || "").toLowerCase();
  if (cat.includes("supplement")) {
    return {
      title: `${product.name} – Pure Daily Nutritional Formula`,
      p1: `This premium ${product.name} supplement is a modern healthcare solution designed to support your daily wellness stack. Formulated under clean lab environments with active bio-available extracts, it goes beyond general nutrition to bolster cellular immunity, metabolism, and long-term physical vigor.`,
      p2: `Its organic formulation integrates verified herbals and antioxidants to help neutralize oxidative stress, helping your body rebuild and maintain balanced stamina easily throughout the day.`
    };
  }
  if (cat.includes("equipment") || cat.includes("device")) {
    return {
      title: `${product.name} – Advanced Health Tracking at Home`,
      p1: `This smart ${product.name} is a modern healthcare device designed to give you a complete overview of your physical health. With advanced sensors and app connectivity, it goes beyond basic weight measurement to provide detailed insights into multiple body metrics, helping you stay on top of your fitness and wellness goals.`,
      p2: `Its sleek, durable design features a high-precision glass platform and clear digital display, making it both stylish and easy to use. Simply step on the scale and sync it with your smartphone to instantly track and monitor your progress over time.`
    };
  }
  if (cat.includes("men")) {
    return {
      title: `${product.name} – Premium Vitality & Performance Booster`,
      p1: `Specially engineered for male health, ${product.name} targets daily recovery, blood flow efficiency, and structural stamina. Combining standardized botanical concentrates with micronutrients, it works dynamically to reduce fatigue and stabilize cortisol markers.`,
      p2: `Made without synthetic binders or additives, this formulation supports clean test reserves, making it a reliable addition to your morning wellness rituals.`
    };
  }
  if (cat.includes("care") || cat.includes("personal")) {
    return {
      title: `${product.name} – Refreshing Organic Body Care`,
      p1: `Experience pure skincare nourishment with ${product.name}. Infused with cold-pressed natural seed oils, it penetrates skin dermis layers to restore vital moisture balance, leaving your face glowing, smooth, and fully hydrated.`,
      p2: `Completely free from parabens, phthalates, and synthetic sulfates, it matches skin pH levels to soothe redness and environmental damage safely.`
    };
  }
  return {
    title: `${product.name} – Quality Assured Healthcare Solution`,
    p1: `The ${product.name} represents high-grade certified quality sourced directly from trusted medical suppliers. Undergoing thorough testing standards for consistency, purity, and potency, it ensures your body gets only reliable wellness resources.`,
    p2: `Ideal for everyday household wellness inventories, it offers safe health assistance you can count on.`
  };
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { data: session } = useSession();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Gallery and Tabs States
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [activeTab, setActiveTab] = useState<"description" | "info" | "reviews">("description");

  // Get sizes either from database (if present) or fallback from category
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes.map((s) => s.name)
    : getCategorySizes(product.category);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  // Related Products states
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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
    fetchReviews();
    setSelectedImage(product.imageUrl);
    if (session?.user) {
      setReviewerName(session.user.name || "");
      setReviewerEmail(session.user.email || "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, product]);

  // Fetch Related Products
  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(product.category)}`);
        const json = await res.json();
        if (json.success && json.data) {
          // Exclude current product and limit to 4
          const filtered = (json.data as Product[])
            .filter((p) => p._id !== product._id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    }
    fetchRelated();
  }, [product]);

  if (!mounted) return null;

  // Calculate size-specific price
  const activeSizeObj = product.sizes?.find((s) => s.name === selectedSize);
  const currentPrice = activeSizeObj ? activeSizeObj.price : product.price;
  const currentOriginalPrice = activeSizeObj 
    ? (activeSizeObj.originalPrice || undefined) 
    : (product.originalPrice || Math.round(product.price * 1.35));

  // Calculate unique cart ID for the selected size
  const cartItemId = product._id + (selectedSize ? `-${selectedSize}` : "");
  const cartItem = cart.find((item) => item._id === cartItemId);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const originalPrice = currentOriginalPrice;

  // Add sized item helper
  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      _id: cartItemId,
      name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
      price: currentPrice,
      selectedSize: selectedSize
    };
    addToCart(cartProduct);
  };

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
        fetchReviews(); // reload reviews
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setReviewError("An error occurred. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  const discountPercent = currentOriginalPrice && currentOriginalPrice > currentPrice 
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const hoverImg = getHoverImageUrl(product);
  const gallery = product.imageGallery && product.imageGallery.length > 0 
    ? [product.imageUrl, ...product.imageGallery] 
    : [product.imageUrl, hoverImg];
  const catTheme = getCategoryColorTheme(product.category);
  const catDetails = getCategoryDetails(product.category);
  const sku = getProductSKU(product);
  const richDesc = product.description
    ? { title: product.name, p1: product.description, p2: "" }
    : getRichDescription(product);

  // Avatar Style helpers
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };
  const getAvatarBg = (name: string) => {
    const colors = [
      "from-emerald-500 to-teal-600",
      "from-blue-500 to-indigo-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-violet-500 to-purple-600"
    ];
    const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  // Review statistics calculation
  const totalReviews = reviews.length;
  const starCounts = [0, 0, 0, 0, 0]; // indices 0 to 4 correspond to 1 to 5 stars
  reviews.forEach(r => {
    const starIdx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    starCounts[starIdx]++;
  });

  return (
    <main className="min-h-screen bg-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Product Details Card (Top Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-16 items-start">
          
          {/* Left Column: Premium Gallery Box */}
          <div className="lg:col-span-6 flex gap-5">
            {/* Vertical Thumbnail Strip */}
            <div className="hidden sm:flex flex-col gap-3 shrink-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl p-2 bg-slate-50 border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20 scale-102"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} gallery view ${idx + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Frame */}
            <div className="flex-1 aspect-square rounded-3xl bg-slate-50 border border-slate-100 p-8 flex items-center justify-center relative overflow-hidden group">
              {/* Dynamic spotlight shadow backdrop */}
              <div className={`absolute -inset-10 bg-gradient-to-br ${catTheme.glow} opacity-60 blur-2xl z-0`} />

              {discountPercent > 0 && (
                <span className="absolute top-5 left-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md z-10">
                  Save {discountPercent}%
                </span>
              )}

              {/* Main Image Swapper */}
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={selectedImage || "/logo/logo.png"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain p-2 mix-blend-multiply"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Product Info */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Breadcrumb Path & Pagination */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-4">
                <div className="flex items-center gap-1">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="capitalize">{product.category}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-800 font-extrabold">{product.name}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-3xl lg:text-4xl text-slate-800 mb-2 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* SKU & Category Tags */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">
                <span>SKU: <span className="text-slate-600">{sku}</span></span>
                <span className="hidden sm:inline text-slate-200">|</span>
                <span>Category: <span className="text-slate-600">{product.category}</span></span>
              </div>

              {/* Price Tag with discount */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-3xl font-black text-slate-900 font-heading">
                  ₹{currentPrice.toFixed(2)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    ₹{currentOriginalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Ratings Summary */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(averageRating)) ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{averageRating}</span>
                <span className="text-slate-350 text-slate-300">({reviews.length} Reviews)</span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-slate-500 font-semibold leading-relaxed mb-6">
                {product.description || "Premium certified product sourced directly from natural, authentic manufacturers. Tested for quality and potency to support healthy lifestyles."}
              </p>

              {/* Highlights/Badges */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.highlights.map((highlight, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> {highlight}
                    </span>
                  ))}
                </div>
              )}

              {/* Interactive Size Selection */}
              <div className="mb-6">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Size:</p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "border-primary bg-primary/5 text-primary scale-102 shadow-sm"
                          : "border-slate-200 text-slate-650 hover:border-slate-400 hover:text-slate-800"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart Controls */}
              <div className="mb-8 pt-4">
                {product.inStock ? (
                  <div className="flex items-center gap-4">
                    {/* Stepper counter */}
                    <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      <button
                        onClick={() => cartQty > 0 && updateQuantity(cartItemId, cartQty - 1)}
                        className="px-4 py-3.5 hover:bg-slate-100 text-slate-600 font-black transition-colors cursor-pointer"
                        disabled={cartQty === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-12 text-center font-bold text-slate-800 text-sm">
                        {cartQty || 1}
                      </div>
                      <button
                        onClick={() => {
                          if (cartQty === 0) {
                            handleAddToCart();
                          } else {
                            updateQuantity(cartItemId, cartQty + 1);
                          }
                        }}
                        className="px-4 py-3.5 hover:bg-slate-100 text-slate-600 font-black transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* CTA button */}
                    <button
                      onClick={() => cartQty === 0 && handleAddToCart()}
                      className={`flex-1 font-black py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer border shadow-sm ${
                        cartQty > 0
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60"
                          : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/10 active:scale-98"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {cartQty > 0 ? "Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                ) : (
                  <div className="text-center bg-red-50 border border-red-150 rounded-2xl py-3.5 text-red-500 font-bold text-sm">
                    ✕ This product is currently out of stock
                  </div>
                )}
              </div>


            </div>

          </div>
        </div>

        {/* Full Width WooCommerce-Style Spec Tabs (Bottom Section) */}
        <div className="border-t border-slate-100 pt-12 mb-16">
          {/* Header tabs navigation */}
          <div className="flex justify-center border-b border-slate-200 gap-10 md:gap-14 mb-8">
            {(["description", "info", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm md:text-base font-black transition-colors duration-200 cursor-pointer focus:outline-none ${
                  activeTab === tab ? "text-slate-800" : "text-slate-450 text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "description" ? "Description" : tab === "info" ? "Additional information" : `Reviews (${reviews.length})`}
                {activeTab === tab && (
                  <motion.div
                    layoutId="bottomTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Body */}
          <div className="min-h-[250px] py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                {/* 1. Description Tab */}
                {activeTab === "description" && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="font-heading font-black text-xl text-slate-800 mb-4">About {product.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {product.description}
                      </p>
                    </div>

                    {product.benefits && (
                      <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
                        <h4 className="font-heading font-black text-lg text-emerald-900 mb-3 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Key Benefits
                        </h4>
                        <div 
                          className="text-sm text-slate-700 leading-relaxed font-medium prose prose-sm prose-emerald max-w-none" 
                          dangerouslySetInnerHTML={{ __html: product.benefits }} 
                        />
                      </div>
                    )}

                    {product.ingredients && (
                      <div>
                        <h4 className="font-heading font-black text-lg text-slate-800 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-500" /> Active Ingredients
                        </h4>
                        <div 
                          className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 prose prose-sm prose-amber max-w-none" 
                          dangerouslySetInnerHTML={{ __html: product.ingredients }} 
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.howToUse && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors">
                          <h4 className="font-heading font-black text-base text-slate-800 mb-3 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" /> How to Use
                          </h4>
                          <div 
                            className="text-sm text-slate-600 font-medium prose prose-sm prose-slate max-w-none" 
                            dangerouslySetInnerHTML={{ __html: product.howToUse }} 
                          />
                        </div>
                      )}
                      
                      {product.whoShouldUse && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors">
                          <h4 className="font-heading font-black text-base text-slate-800 mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-500" /> Who Should Use
                          </h4>
                          <div 
                            className="text-sm text-slate-600 font-medium prose prose-sm prose-slate max-w-none" 
                            dangerouslySetInnerHTML={{ __html: product.whoShouldUse }} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Additional Information Tab */}
                {activeTab === "info" && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <table className="w-full text-sm font-semibold">
                      <tbody>
                        <tr className="border-b border-slate-200/60 pb-3">
                          <td className="py-3 text-slate-400 w-1/3">SKU</td>
                          <td className="py-3 text-slate-700">{sku}</td>
                        </tr>
                        <tr className="border-b border-slate-200/60 py-3">
                          <td className="py-3 text-slate-400">Category</td>
                          <td className="py-3 text-slate-700 capitalize">{product.category}</td>
                        </tr>
                        <tr className="border-b border-slate-200/60 py-3">
                          <td className="py-3 text-slate-400">Availability</td>
                          <td className="py-3 text-slate-700">
                            {product.inStock ? "In Stock & Ready to Ship" : "Out of Stock"}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200/60 py-3">
                          <td className="py-3 text-slate-400">Directions for Use</td>
                          <td className="py-3 text-slate-700">{catDetails.usage}</td>
                        </tr>
                        <tr className="border-b border-slate-200/60 py-3">
                          <td className="py-3 text-slate-400">Shipping Guarantee</td>
                          <td className="py-3 text-slate-700">Free Express Delivery (2-3 Business Days)</td>
                        </tr>
                        <tr className="py-3">
                          <td className="py-3 text-slate-400">Return Policy</td>
                          <td className="py-3 text-slate-700">Easy 7-Day Replacement window</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Verified Reviews list */}
                    <div className="lg:col-span-7 space-y-8">
                      {/* Reviews Chart Breakdown */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          {/* Score */}
                          <div className="md:col-span-4 text-center md:border-r md:border-slate-200 md:pr-6">
                            <p className="text-5xl font-black text-slate-800 font-heading leading-none">{averageRating}</p>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-2">Average Score</p>
                            <div className="flex items-center justify-center text-amber-400 mt-2.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.round(Number(averageRating)) ? "fill-current" : "text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Based on {totalReviews} reviews</p>
                          </div>

                          {/* Progress bars */}
                          <div className="md:col-span-8 space-y-2">
                            {[5, 4, 3, 2, 1].map((stars) => {
                              const count = starCounts[stars - 1];
                              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                              return (
                                <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                                  <span className="w-10 text-slate-500 text-right">{stars} star</span>
                                  <div className="flex-1 h-2 rounded-full bg-slate-200/60 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${percent}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.5, delay: 0.1 }}
                                      className="h-full bg-amber-400 rounded-full"
                                    />
                                  </div>
                                  <span className="w-8 text-slate-500">{percent}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Verified feedbacks */}
                      <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin">
                        {reviews.length === 0 ? (
                          <div className="text-center py-12 text-slate-400">
                            <Award className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-500">No reviews yet for this product.</p>
                            <p className="text-xs text-slate-400 mt-1">Be the first to share your experience!</p>
                          </div>
                        ) : (
                          reviews.map((review) => (
                            <div key={review._id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                              <div className="flex gap-4">
                                {/* Dynamic Avatar Initials */}
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarBg(review.userName)} text-white font-black text-xs flex items-center justify-center shadow-md uppercase shrink-0`}>
                                  {getInitials(review.userName)}
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-extrabold text-slate-800">{review.userName}</span>
                                    <span className="text-[10px] text-slate-400 font-semibold inline-flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>

                                  <div className="flex items-center text-amber-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < review.rating ? "fill-current" : "text-slate-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-xs text-slate-650 text-slate-500 font-medium leading-relaxed">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right Column: Write a Review Form */}
                    <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-6">
                      <h3 className="font-heading font-black text-lg text-slate-800 mb-6 pb-4 border-b border-slate-200/80">
                        Share Your Experience
                      </h3>

                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Rating Star selection */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-550 text-slate-500 uppercase tracking-widest mb-2">Your Rating</label>
                          <div className="flex gap-2 bg-white border border-slate-200 rounded-xl p-2.5 w-fit">
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                key={stars}
                                type="button"
                                onClick={() => setRatingInput(stars)}
                                className="text-amber-400 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    stars <= ratingInput ? "fill-current" : "text-slate-205 text-slate-200"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name input */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-550 text-slate-500 uppercase tracking-widest mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            disabled={!!session?.user}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-primary transition-all text-xs font-semibold disabled:opacity-75"
                          />
                        </div>

                        {/* Email input */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-550 text-slate-500 uppercase tracking-widest mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                            disabled={!!session?.user}
                            placeholder="e.g. john@example.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-primary transition-all text-xs font-semibold disabled:opacity-75"
                          />
                        </div>

                        {/* Comments textarea */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-550 text-slate-500 uppercase tracking-widest mb-1">
                            Written Comment
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Write details about the product packaging, quality, efficacy..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-primary transition-all text-xs font-semibold resize-none"
                          />
                        </div>

                        {reviewError && <p className="text-xs text-red-500 font-bold">{reviewError}</p>}
                        {reviewSuccess && <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 p-3 rounded-xl leading-relaxed">{reviewSuccess}</p>}

                        <button
                          type="submit"
                          disabled={reviewLoading}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </div>

                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products Section (Bottom Row) */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 pt-16">
            <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-800 text-center mb-10">
              Related Products
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
