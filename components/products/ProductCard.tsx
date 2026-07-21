"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  imageUrl: string;
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  cartQty?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (e: React.MouseEvent) => void;
  onAddToCart?: () => void;
  onIncreaseQty?: () => void;
  onDecreaseQty?: () => void;
  variant?: "default" | "deal" | "wishlist";
  claimedPercent?: number;
  itemsLeft?: number;
}

function getHoverImageUrl(product: Product): string {
  if ((product as any).hoverImageUrl) {
    return (product as any).hoverImageUrl;
  }

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

  // If no hover image is specified and it's not a known fallback, just use the same primary image so it doesn't swap to an unrelated placeholder
  return url;
}

function renderCardPrice(product: Product) {
  // If it's a specific product name or equipment, show price range to match WooCommerce mockup style
  if (product.name.includes("Pulse Massager")) {
    return "₹180.00 – ₹210.00";
  }
  if (product.name.includes("Bracelet")) {
    return "₹30.00 – ₹40.00";
  }
  if (product.name.includes("Foot Massager")) {
    return "₹60.00 – ₹80.00";
  }
  if (product.name.includes("Smart Scale")) {
    return "₹140.00 – ₹340.00";
  }

  // Default layout: Price with crossed out original price if available
  const original = product.originalPrice || Math.round(product.price * 1.35);
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="font-bold text-slate-800 text-[13px]">
        ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {original > product.price && (
        <span className="text-slate-400 line-through font-normal text-[11px]">
          ₹{original.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({
  product,
  cartQty = 0,
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
  variant = "default",
  claimedPercent,
  itemsLeft,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverImageUrl = getHoverImageUrl(product);

  // Global Zustand Stores
  const storeAddToCart = useCartStore((state) => state.addToCart);
  const storeToggleWishlist = useCartStore((state) => state.toggleWishlist);
  const storeWishlist = useCartStore((state) => state.wishlist || []);
  const storeCart = useCartStore((state) => state.cart || []);
  const storeUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const storeRemoveFromCart = useCartStore((state) => state.removeFromCart);

  // Determine active quantity in cart
  const itemInCart = storeCart.find((item) => item._id === product._id);
  const activeCartQty = cartQty > 0 ? cartQty : (itemInCart ? itemInCart.quantity : 0);
  const inCart = activeCartQty > 0;

  // Determine active wishlist state
  const activeIsWishlisted = onWishlistToggle ? isWishlisted : storeWishlist.some((item) => item._id === product._id);

  // Handlers
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    } else {
      storeAddToCart(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(e);
    } else {
      storeToggleWishlist(product);
    }
  };

  const handleIncreaseQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onIncreaseQty) {
      onIncreaseQty();
    } else {
      storeUpdateQuantity(product._id, activeCartQty + 1);
    }
  };

  const handleDecreaseQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDecreaseQty) {
      onDecreaseQty();
    } else {
      if (activeCartQty <= 1) {
        storeRemoveFromCart(product._id);
      } else {
        storeUpdateQuantity(product._id, activeCartQty - 1);
      }
    }
  };

  // Calculate prices & discount percentage
  const fallbackOriginalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discount = fallbackOriginalPrice > product.price 
    ? Math.round(((fallbackOriginalPrice - product.price) / fallbackOriginalPrice) * 100) 
    : 0;

  // Mock consistent reviews count based on name/ID hash
  const charSum = (product._id || product.name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const reviewsCount = (charSum % 3) + 1;

  const badgeBg = discount % 2 === 0 ? "bg-[#C25115]" : "bg-[#0D623F]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col w-full bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 overflow-hidden"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative aspect-square m-2 rounded-2xl overflow-hidden bg-[#F8F9FA] border border-slate-100/50">
        <Link href={`/products/${product._id}`} className="absolute inset-0 z-0 block">
          {/* Primary Image */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-103">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-all duration-550 ${isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              loading="lazy"
            />
          </div>

          {/* Hover Image */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-103">
            <Image
              src={hoverImageUrl}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-all duration-550 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              loading="lazy"
            />
          </div>
        </Link>

        {/* Floating Actions on Top-Right */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-20">
          {/* Cart Icon Button */}
          {variant !== "wishlist" && (
            <button
              onClick={handleAddToCartClick}
              className={`w-9 h-9 rounded-full border border-slate-100 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                inCart 
                  ? "bg-[#0D623F] border-[#0D623F] text-white shadow-emerald-600/20" 
                  : "bg-white text-slate-700 hover:text-[#0D623F]"
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          {/* Wishlist Icon Button */}
          {variant !== "wishlist" ? (
            <button
              onClick={handleWishlistClick}
              className={`w-9 h-9 rounded-full border border-slate-100 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                activeIsWishlisted 
                  ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20" 
                  : "bg-white text-slate-700 hover:text-rose-500"
              }`}
              aria-label={activeIsWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="w-4 h-4" fill={activeIsWishlisted ? "currentColor" : "none"} />
            </button>
          ) : (
            /* Trash/Remove Button for Wishlist Page Variant */
            <button
              onClick={handleWishlistClick}
              className="w-9 h-9 rounded-full border border-slate-100 shadow-sm bg-white text-slate-400 hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Remove item"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
            </button>
          )}
        </div>

        {/* Top-Left Discount Badge */}
        {discount > 0 && (
          <span className={`absolute top-3.5 left-3.5 ${badgeBg} text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider z-10 select-none`}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* ── CARD CONTENT (Centered details below image) ── */}
      <div className="text-center pt-3 pb-5 px-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest leading-none mb-1.5">
              {product.category}
            </p>
          )}

          {/* Title */}
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="text-[13px] font-bold text-slate-800 leading-snug min-h-[38px] group-hover:text-primary transition-colors duration-300 line-clamp-2 px-1">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="pt-1">
            {renderCardPrice(product)}
          </div>

          {/* Star Ratings Row */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-current"
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-normal">
              ({reviewsCount} Reviews)
            </span>
          </div>

          {/* Deal details claim bar */}
          {variant === "deal" && claimedPercent !== undefined && itemsLeft !== undefined && (
            <div className="space-y-1 pt-3 max-w-[150px] mx-auto">
              <div className="flex justify-between text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">
                <span>{claimedPercent}% claimed</span>
                <span className="text-red-500">{itemsLeft} Left</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E07A5F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${claimedPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart Footer Row */}
        <div className="flex items-center gap-2 pt-4 px-1">
          {inCart ? (
            <div className="flex-grow flex items-center justify-between bg-[#EAF6F0] rounded-full p-1 border border-[#10B981]/15">
              <button
                onClick={handleDecreaseQty}
                className="w-7 h-7 rounded-full bg-white text-[#0D623F] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm active:scale-90 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="font-extrabold text-[#0D623F] text-xs px-2 min-w-[20px] text-center select-none">
                {activeCartQty}
              </span>
              <button
                onClick={handleIncreaseQty}
                className="w-7 h-7 rounded-full bg-white text-[#0D623F] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm active:scale-90 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCartClick}
              className="flex-grow py-2.5 px-4 bg-[#EAF6F0] text-[#0D623F] hover:bg-[#dcede3] active:scale-95 transition-all rounded-full font-bold text-xs text-center cursor-pointer"
            >
              Add to Cart
            </button>
          )}
          <button
            onClick={handleAddToCartClick}
            className="w-9 h-9 rounded-full bg-[#0D623F] text-white flex items-center justify-center hover:bg-[#0a4d32] active:scale-95 transition-all cursor-pointer shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
