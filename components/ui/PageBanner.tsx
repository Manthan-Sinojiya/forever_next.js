"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface PageBannerProps {
  banner?: {
    title?: string;
    subtitle?: string;
    image?: string;
    tabletImage?: string;
    mobileImage?: string;
    link?: string;
    buttonText?: string;
  } | null;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultGradient?: string;
  badge?: string;
  className?: string;
}

export default function PageBanner({
  banner,
  defaultTitle = "Welcome to Forever Healthcare",
  defaultSubtitle = "Discover premium Ayurvedic and natural healthcare products.",
  defaultGradient = "from-[#1E5AA8] via-[#2A75C3] to-[#43B97F]",
  badge = "Special Offer",
  className = "",
}: PageBannerProps) {
  const title = banner?.title || defaultTitle;
  const subtitle = banner?.subtitle || defaultSubtitle;
  const desktopImage = banner?.image;
  const tabletImage = banner?.tabletImage || desktopImage;
  const mobileImage = banner?.mobileImage || tabletImage || desktopImage;
  const link = banner?.link;
  const buttonText = banner?.buttonText || "Explore Now";

  return (
    <div className={`relative overflow-hidden rounded-[2rem] shadow-xl border border-white/20 my-6 ${className}`}>
      {/* Background Image / Responsive Art Direction */}
      {desktopImage ? (
        <div className="absolute inset-0 z-0">
          <picture className="w-full h-full object-cover">
            {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
            {tabletImage && <source media="(max-width: 1024px)" srcSet={tabletImage} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={desktopImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </picture>
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent z-10" />
        </div>
      ) : (
        /* Fallback gradient background */
        <div className={`absolute inset-0 z-0 bg-gradient-to-r ${defaultGradient}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 md:py-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight mb-4 drop-shadow-md">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed mb-6 max-w-xl drop-shadow">
              {subtitle}
            </p>
          )}

          {/* CTA Button */}
          {link && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={link}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all duration-200"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
