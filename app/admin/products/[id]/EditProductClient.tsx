"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProduct } from "@/actions/admin/products";
import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2, ArrowLeft, Save, Check, AlertCircle, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  tags: z.string().optional(),
  
  // Pricing & Stock
  mrp: z.number().min(0, "MRP must be non-negative"),
  price: z.number().optional(),
  taxType: z.enum(["inclusive", "exclusive"]).optional(),
  gst: z.number().optional(),
  inventory: z.number().min(0, "Inventory must be non-negative"),
  inStock: z.boolean().optional(),
  customShippingEnabled: z.boolean().optional(),
  shippingCharges: z.array(
    z.object({
      location: z.string().min(1, "Location is required"),
      charge: z.number().min(0, "Charge must be non-negative")
    })
  ).optional(),
  
  // Physical
  weight: z.string().optional(),
  
  // Content
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  howToUse: z.string().optional(),
  storage: z.string().optional(),
  
  // Status
  status: z.enum(["active", "draft", "archived"]),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  
  // SEO
  metaTitle: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaDescription: z.string().optional(),
  thumbnailAlt: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const tabs = [
  "General",
  "Media",
  "Pricing, Inventory & Delivery",
  "Content & Details",
  "Healthcare Specific"
];

export default function EditProductClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("General");
  
  // Rich text states
  const [descriptionContent, setDescriptionContent] = useState(initialData?.description || "");
  const [ingredientsContent, setIngredientsContent] = useState(initialData?.ingredients || "");
  const [benefitsContent, setBenefitsContent] = useState(initialData?.benefits || "");
  const [howToUseContent, setHowToUseContent] = useState(initialData?.howToUse || "");
  
  // Media state
  const [thumbnail, setThumbnail] = useState<string>(initialData?.thumbnail || "");
  const [thumbnailAlt, setThumbnailAlt] = useState<string>(initialData?.thumbnailAlt || "");
  const [images, setImages] = useState<{ url: string; alt: string }[]>(initialData?.images || []);
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const addImage = () => {
    setImages([...images, { url: "", alt: "" }]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const updateImage = (index: number, field: "url" | "alt", value: string) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      category: initialData?.category || "",
      subCategory: initialData?.subCategory || "",
      tags: initialData?.tags?.join(", ") || "",
      status: initialData?.status || "active",
      inventory: initialData?.inventory || 0,
      mrp: initialData?.mrp || 0,
      price: initialData?.price || undefined,
      taxType: initialData?.taxType || "inclusive",
      gst: initialData?.gst || 0,
      inStock: initialData?.inStock ?? true,
      customShippingEnabled: initialData?.customShippingEnabled || false,
      shippingCharges: initialData?.shippingCharges || [],
      isFeatured: initialData?.isFeatured || false,
      isTrending: initialData?.isTrending || false,
      isBestSeller: initialData?.isBestSeller || false,
      isNewArrival: initialData?.isNewArrival || false,
      weight: initialData?.weight || "",
      shortDescription: initialData?.shortDescription || "",
      storage: initialData?.storage || "",
      metaTitle: initialData?.metaTitle || "",
      metaKeywords: initialData?.metaKeywords || "",
      metaDescription: initialData?.metaDescription || "",
    }
  });

  const nameVal = watch("name");
  useEffect(() => {
    if (nameVal && !initialData?.slug) {
      const generatedSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue("slug", generatedSlug);
    }
  }, [nameVal, setValue, initialData]);

  useEffect(() => {
    if (!initialData?.sku) {
      setValue("sku", `FHC-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [setValue, initialData]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        price: data.price !== undefined ? data.price : data.mrp,
        thumbnail,
        thumbnailAlt,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        description: descriptionContent || data.description,
        ingredients: ingredientsContent,
        benefits: benefitsContent,
        howToUse: howToUseContent,
        images: images.filter(img => img.url !== ""),
        taxType: data.taxType || "inclusive",
        gst: (data.taxType === "exclusive") ? data.gst : undefined,
        customShippingEnabled: data.customShippingEnabled || false,
        shippingCharges: data.customShippingEnabled ? data.shippingCharges || [] : [],
      };
      
      const res = await updateProduct(initialData._id, payload);
      if (res.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(res.error || "Failed to update product");
        toast.error(res.error || "Failed to update product");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusVal = watch("status");
  const inStockVal = watch("inStock");

  return (
    <div className="pb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Product</h1>
            <p className="text-slate-500">Update product details, pricing, and media.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Discard
            </button>
            <button 
              type="submit"
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

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-3 mb-6 bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Tabs Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/60 p-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <nav className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`
                      relative flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${activeTab === tab 
                        ? "text-indigo-700 bg-indigo-50" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }
                    `}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" 
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Column - Form Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-8">
                <AnimatePresence mode="wait">
                  
                  {activeTab === "General" && (
                    <motion.div 
                      key="general"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Basic Information</h3>
                        <p className="text-sm text-slate-500 mt-1">Provide the fundamental details of your product.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name <span className="text-rose-500">*</span></label>
                          <input 
                            {...register("name")} 
                            placeholder="e.g. Organic Ashwagandha Powder"
                            className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white`} 
                          />
                          {errors.name && <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5 font-medium"><AlertCircle className="w-3 h-3"/> {errors.name.message}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug (URL) <span className="text-rose-500">*</span></label>
                          <div className="flex rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all bg-slate-50 focus-within:bg-white">
                            <span className="flex items-center px-4 border-r border-slate-200 bg-slate-100 text-slate-500 text-sm">forever.com/products/</span>
                            <input 
                              {...register("slug")} 
                              placeholder="organic-ashwagandha-powder"
                              className="w-full bg-transparent px-4 py-2.5 text-sm outline-none" 
                            />
                          </div>
                          {errors.slug && <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5 font-medium"><AlertCircle className="w-3 h-3"/> {errors.slug.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-8 pt-6 border-t border-slate-200 mt-8">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">SEO & Visibility</h3>
                          <p className="text-sm text-slate-500 mt-1">Control how your product appears on the store and search engines.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className={`
                            relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all
                            ${statusVal === "active" ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}
                          `}>
                            <div>
                              <p className={`text-sm font-bold ${statusVal === "active" ? 'text-indigo-900' : 'text-slate-700'}`}>Published Status</p>
                              <p className="text-xs text-slate-500 mt-0.5">Visible on storefront</p>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={statusVal === "active"}
                                onChange={(e) => setValue("status", e.target.checked ? "active" : "draft")}
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                            </div>
                          </label>

                          <label className={`
                            relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all
                            ${inStockVal ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}
                          `}>
                            <div>
                              <p className={`text-sm font-bold ${inStockVal ? 'text-emerald-900' : 'text-slate-700'}`}>In Stock</p>
                              <p className="text-xs text-slate-500 mt-0.5">Available for purchase</p>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={inStockVal}
                                onChange={(e) => setValue("inStock", e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                            </div>
                          </label>

                          <label className={`
                            relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all
                            ${watch("isFeatured") ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}
                          `}>
                            <div>
                              <p className={`text-sm font-bold ${watch("isFeatured") ? 'text-amber-900' : 'text-slate-700'}`}>Featured Product</p>
                              <p className="text-xs text-slate-500 mt-0.5">Show in featured sections</p>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={watch("isFeatured")}
                                onChange={(e) => setValue("isFeatured", e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                            </div>
                          </label>

                          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-center gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input type="checkbox" {...register("isTrending")} className="peer sr-only" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors group-hover:border-indigo-400"></div>
                                <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Mark as Trending</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input type="checkbox" {...register("isBestSeller")} className="peer sr-only" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors group-hover:border-indigo-400"></div>
                                <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Mark as Best Seller</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input type="checkbox" {...register("todayDeal")} className="peer sr-only" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors group-hover:border-indigo-400"></div>
                                <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Lightning Deal</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-200/60 mt-8">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Search Engine Optimization</h4>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Title</label>
                            <input 
                              {...register("metaTitle")} 
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
                            <textarea 
                              {...register("metaDescription")} 
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:bg-white resize-y" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Keywords</label>
                            <input 
                              {...register("metaKeywords")} 
                              placeholder="ayurveda, health, natural..."
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white" 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Media" && (
                    <motion.div 
                      key="media"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Thumbnail Image</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">Main image used for Cart, Wishlist, Checkout, and Product Cards.</p>
                        <div className="w-full sm:w-96 space-y-4">
                          <ImageUpload 
                            value={thumbnail}
                            onChange={setThumbnail}
                            label="Thumbnail"
                          />
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Thumbnail Alt Text</label>
                            <input 
                              value={thumbnailAlt}
                              onChange={(e) => setThumbnailAlt(e.target.value)}
                              placeholder="Describe the image for SEO..."
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Product Gallery</h3>
                          <p className="text-sm text-slate-500 mt-1">Upload high-quality images for your product.</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={addImage}
                          className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-colors border border-indigo-100/50"
                        >
                          <Plus className="w-4 h-4" /> Add Image
                        </button>
                      </div>
                      
                      {images.length === 0 ? (
                        <div 
                          onClick={addImage}
                          className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-colors cursor-pointer group"
                        >
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                            <ImageIcon className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="text-slate-600 font-medium mb-1">Upload product images</p>
                          <p className="text-xs text-slate-400">Click to add your first image to the gallery</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {images.map((image, index) => (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                key={`${index}-${image.url}`} 
                              >
                                <div
                                  draggable
                                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                                    setDraggedItemIdx(index);
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                                  onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                                    e.preventDefault();
                                    if (draggedItemIdx === null || draggedItemIdx === index) return;
                                    const newImages = [...images];
                                    const item = newImages[draggedItemIdx];
                                    newImages.splice(draggedItemIdx, 1);
                                    newImages.splice(index, 0, item);
                                    setImages(newImages);
                                    setDraggedItemIdx(null);
                                  }}
                                  className={`flex flex-col sm:flex-row gap-6 p-5 border rounded-2xl relative group transition-all ${draggedItemIdx === index ? 'opacity-50 border-indigo-400 bg-indigo-50/50' : 'border-slate-200/60 bg-slate-50/50 hover:border-indigo-200 hover:shadow-sm cursor-move'}`}
                                >
                                  <button 
                                    type="button" 
                                    onClick={() => removeImage(index)}
                                    className="absolute top-3 right-3 p-2 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100 hover:text-rose-600 hover:border-rose-200 transition-colors z-10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <div className="w-full sm:w-48 flex-shrink-0">
                                    <ImageUpload 
                                      value={image.url}
                                      onChange={(url) => updateImage(index, "url", url)}
                                      label={`Image ${index + 1}`}
                                    />
                                  </div>
                                  <div className="flex-1 space-y-4 w-full">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Image URL</label>
                                      <input 
                                        value={image.url}
                                        onChange={(e) => updateImage(index, "url", e.target.value)}
                                        placeholder="Auto-filled on upload or enter manually"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Alt Text (SEO)</label>
                                      <input 
                                        value={image.alt}
                                        onChange={(e) => updateImage(index, "alt", e.target.value)}
                                        placeholder="Describe the image for SEO..."
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "Pricing, Inventory & Delivery" && (
                    <motion.div 
                      key="pricing"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Pricing & Inventory</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage product pricing, stock levels, and SKUs.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 border border-slate-200/60 rounded-2xl">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">MRP (₹) <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                            <input 
                              type="number" 
                              step="0.01"
                              {...register("mrp", { valueAsNumber: true })} 
                              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-4" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Selling Price (₹)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                            <input 
                              type="number" 
                              step="0.01"
                              {...register("price", { setValueAs: (v) => v === "" || v === null || v === undefined ? undefined : Number(v) })} 
                              placeholder="If empty, uses MRP"
                              className={`w-full bg-white border ${errors.price ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100'} rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-4`} 
                            />
                          </div>
                          {errors.price && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.price.message}</p>}
                        </div>
                      </div>
                      
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tax Setup</label>
                          <select 
                            {...register("taxType")} 
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white"
                          >
                            <option value="inclusive">Taxes are included in prices</option>
                            <option value="exclusive">Add tax (GST) separately</option>
                          </select>
                        </div>
                        {watch("taxType") === "exclusive" && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">GST (%)</label>
                            <input 
                              type="number" 
                              {...register("gst", { valueAsNumber: true })} 
                              placeholder="18"
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white" 
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-6 pt-6 border-t border-slate-200/60 mt-8">
                        <h4 className="text-sm font-bold text-slate-900 tracking-wider">Inventory</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU (Stock Keeping Unit)</label>
                            <input 
                              {...register("sku")} 
                              placeholder="PROD-001"
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Available Stock <span className="text-rose-500">*</span></label>
                            <input 
                              type="number" 
                              {...register("inventory", { valueAsNumber: true })} 
                              className={`w-full bg-slate-50 border ${errors.inventory ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:bg-white`} 
                            />
                            {errors.inventory && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.inventory.message}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-slate-200/60 mt-8">
                        <h4 className="text-sm font-bold text-slate-900 tracking-wider">Delivery & Shipping</h4>
                        <div className="space-y-4">
                          <label className={`
                            relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all
                            ${watch("customShippingEnabled") ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}
                          `}>
                            <div>
                              <p className={`text-sm font-bold ${watch("customShippingEnabled") ? 'text-indigo-900' : 'text-slate-700'}`}>Custom Shipping Rates</p>
                              <p className="text-xs text-slate-500 mt-0.5">Configure specific shipping charges for this product per location.</p>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={watch("customShippingEnabled")}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setValue("customShippingEnabled", val);
                                  if (val && (!watch("shippingCharges") || watch("shippingCharges")?.length === 0)) {
                                    setValue("shippingCharges", [{ location: "", charge: 0 }]);
                                  }
                                }}
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                            </div>
                          </label>

                          {watch("customShippingEnabled") && (
                            <div className="border border-slate-200/60 rounded-2xl p-6 space-y-4 bg-white/50">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-800">Location Rates</h4>
                                  <p className="text-xs text-slate-500">Add shipping rates based on location/pincode.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const existing = watch("shippingCharges") || [];
                                    setValue("shippingCharges", [...existing, { location: "", charge: 0 }]);
                                  }}
                                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Location
                                </button>
                              </div>
                              {(watch("shippingCharges") || []).map((chargeObj, index) => (
                                <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">State / City / Pincode</label>
                                    <input 
                                      {...register(`shippingCharges.${index}.location` as const)}
                                      placeholder="e.g. Maharashtra or 400001"
                                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" 
                                    />
                                  </div>
                                  <div className="w-32">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Charge (₹)</label>
                                    <input 
                                      type="number"
                                      {...register(`shippingCharges.${index}.charge` as const, { valueAsNumber: true })}
                                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" 
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = watch("shippingCharges") || [];
                                      current.splice(index, 1);
                                      setValue("shippingCharges", current);
                                    }}
                                    className="p-2 text-slate-400 bg-white rounded-lg shadow-sm border border-slate-200 hover:text-rose-600 hover:border-rose-200 transition-colors mb-0.5"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Content & Details" && (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Rich Content</h3>
                        <p className="text-sm text-slate-500 mt-1">Detailed descriptions to engage your customers.</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
                        <p className="text-xs text-slate-500 mb-2">A quick summary that appears on product cards.</p>
                        <textarea 
                          {...register("shortDescription")} 
                          rows={3}
                          placeholder="Brief description..."
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-indigo-100 focus:border-indigo-400 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:bg-white resize-y" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Long Description <span className="text-rose-500">*</span></label>
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                          <JoditEditor
                            value={descriptionContent}
                            config={{ readonly: false, placeholder: "Start typing the full description here...", minHeight: 400 }}
                            onBlur={newContent => setDescriptionContent(newContent)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Healthcare Specific" && (
                    <motion.div 
                      key="healthcare"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Healthcare Data</h3>
                        <p className="text-sm text-slate-500 mt-1">Specific details for health and wellness products.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Ingredients</label>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                            <JoditEditor
                              value={ingredientsContent}
                              config={{ readonly: false, placeholder: "List of ingredients and their amounts...", minHeight: 400 }}
                              onBlur={newContent => setIngredientsContent(newContent)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Key Benefits</label>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                            <JoditEditor
                              value={benefitsContent}
                              config={{ readonly: false, placeholder: "Health benefits of this product...", minHeight: 400 }}
                              onBlur={newContent => setBenefitsContent(newContent)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">How To Use</label>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                            <JoditEditor
                              value={howToUseContent}
                              config={{ readonly: false, placeholder: "Dosage and usage instructions...", minHeight: 400 }}
                              onBlur={newContent => setHowToUseContent(newContent)}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                    }}
                    disabled={tabs.indexOf(activeTab) === 0}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                        handleSubmit(onSubmit)(); // Auto-save on next
                      } else {
                        handleSubmit(onSubmit)();
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-70 transition-all"
                  >
                    {isSubmitting ? "Saving..." : (tabs.indexOf(activeTab) === tabs.length - 1 ? "Save All Changes" : "Next & Save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
