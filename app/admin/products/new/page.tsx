"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/actions/admin/products";
import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2 } from "lucide-react";

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
  gst: z.number().optional(),
  inventory: z.number().min(0, "Inventory must be non-negative"),
  inStock: z.boolean().optional(),
  
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
});

type ProductFormValues = z.infer<typeof productSchema>;

const tabs = [
  "General",
  "Media",
  "Pricing & Inventory",
  "Content & Details",
  "Healthcare Specific",
  "SEO & Settings"
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("General");
  
  // Rich text states
  const [descriptionContent, setDescriptionContent] = useState("");
  const [ingredientsContent, setIngredientsContent] = useState("");
  const [benefitsContent, setBenefitsContent] = useState("");
  const [howToUseContent, setHowToUseContent] = useState("");
  
  // Media state
  const [thumbnail, setThumbnail] = useState<string>("");
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);
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
      status: "active",
      inventory: 0,
      mrp: 0,
      price: undefined,
      inStock: true,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      isNewArrival: false,
    }
  });

  const nameVal = watch("name");
  useEffect(() => {
    if (nameVal) {
      const generatedSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue("slug", generatedSlug);
    }
  }, [nameVal, setValue]);

  useEffect(() => {
    setValue("sku", `FHC-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        price: data.price !== undefined ? data.price : data.mrp,
        thumbnail,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        description: descriptionContent || data.description,
        ingredients: ingredientsContent,
        benefits: benefitsContent,
        howToUse: howToUseContent,
        images: images.filter(img => img.url !== "")
      };
      
      const res = await createProduct(payload);
      if (res.success) {
        router.push("/admin/products");
      } else {
        setError(res.error || "Failed to create product");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusVal = watch("status");
  const inStockVal = watch("inStock");

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">New Product</h1>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="flex flex-wrap border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-emerald-600 text-emerald-700 bg-slate-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {activeTab === "General" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                      <input 
                        {...register("name")} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL) *</label>
                      <input 
                        {...register("slug")} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                      {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Media" && (
                <div className="space-y-8">
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Thumbnail Image</h3>
                    <p className="text-xs text-slate-500 mb-4">Main image used for Cart, Wishlist, Checkout, and Product Cards.</p>
                    <div className="w-48">
                      <ImageUpload 
                        value={thumbnail}
                        onChange={setThumbnail}
                        label="Thumbnail"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                    <h3 className="text-sm font-semibold text-slate-800">Product Gallery</h3>
                    <button 
                      type="button" 
                      onClick={addImage}
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100 transition-colors"
                    >
                      <Plus size={16} /> Add Image
                    </button>
                  </div>
                  
                  {images.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-lg">
                      <p className="text-slate-500 mb-4">No images added yet.</p>
                      <button 
                        type="button" 
                        onClick={addImage}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        Click to add the first image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {images.map((image, index) => (
                        <div 
                          key={`${index}-${image.url}`} 
                          draggable
                          onDragStart={(e: React.DragEvent) => {
                            setDraggedItemIdx(index);
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragOver={(e: React.DragEvent) => e.preventDefault()}
                          onDrop={(e: React.DragEvent) => {
                            e.preventDefault();
                            if (draggedItemIdx === null || draggedItemIdx === index) return;
                            const newImages = [...images];
                            const item = newImages[draggedItemIdx];
                            newImages.splice(draggedItemIdx, 1);
                            newImages.splice(index, 0, item);
                            setImages(newImages);
                            setDraggedItemIdx(null);
                          }}
                          className={`flex gap-6 p-4 border rounded-lg items-start relative group transition-all ${draggedItemIdx === index ? 'opacity-50 border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 cursor-move'}`}
                        >
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 text-red-500 bg-white rounded shadow hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="w-48 flex-shrink-0">
                            <ImageUpload 
                              value={image.url}
                              onChange={(url) => updateImage(index, "url", url)}
                              label={`Image ${index + 1}`}
                            />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                              <input 
                                value={image.url}
                                onChange={(e) => updateImage(index, "url", e.target.value)}
                                placeholder="Auto-filled on upload or enter manually"
                                className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Alt Text (SEO)</label>
                              <input 
                                value={image.alt}
                                onChange={(e) => updateImage(index, "alt", e.target.value)}
                                placeholder="Describe the image for SEO..."
                                className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Pricing & Inventory" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        {...register("mrp", { valueAsNumber: true })} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        {...register("price", { setValueAs: (v) => v === "" || v === null || v === undefined ? undefined : Number(v) })} 
                        placeholder="If empty, uses MRP"
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                      <input 
                        {...register("sku")} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity *</label>
                      <input 
                        type="number" 
                        {...register("inventory", { valueAsNumber: true })} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                      {errors.inventory && <p className="text-red-500 text-xs mt-1">{errors.inventory.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">GST (%)</label>
                      <input 
                        type="number" 
                        {...register("gst", { valueAsNumber: true })} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Content & Details" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Rich Content</h3>
                    <p className="text-xs text-slate-500 mb-4">Main product description using Jodit editor. Short description is auto-generated.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Short Description (Auto-generated)</label>
                    <textarea 
                      {...register("shortDescription")} 
                      rows={3}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Long Description *</label>
                    <div className="border border-slate-300 rounded-md overflow-hidden">
                      <JoditEditor
                        value={descriptionContent}
                        config={{ readonly: false, placeholder: "Start typing..." }}
                        onBlur={newContent => setDescriptionContent(newContent)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Healthcare Specific" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Healthcare Specific Data</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ingredients</label>
                    <div className="border border-slate-300 rounded-md overflow-hidden">
                      <JoditEditor
                        value={ingredientsContent}
                        config={{ readonly: false, placeholder: "List of ingredients..." }}
                        onBlur={newContent => setIngredientsContent(newContent)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Benefits</label>
                    <div className="border border-slate-300 rounded-md overflow-hidden">
                      <JoditEditor
                        value={benefitsContent}
                        config={{ readonly: false, placeholder: "Health benefits..." }}
                        onBlur={newContent => setBenefitsContent(newContent)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">How To Use</label>
                    <div className="border border-slate-300 rounded-md overflow-hidden">
                      <JoditEditor
                        value={howToUseContent}
                        config={{ readonly: false, placeholder: "Usage instructions..." }}
                        onBlur={newContent => setHowToUseContent(newContent)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "SEO & Settings" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">SEO & Visibility</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Published</p>
                        <p className="text-xs text-slate-500">Make this product visible on the storefront.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={statusVal === "active"}
                          onChange={(e) => setValue("status", e.target.checked ? "active" : "draft")}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">In Stock</p>
                        <p className="text-xs text-slate-500">Allow customers to purchase this product.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={inStockVal}
                          onChange={(e) => setValue("inStock", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Featured Product</p>
                        <p className="text-xs text-slate-500">Show on homepage featured sections.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={watch("isFeatured")}
                          onChange={(e) => setValue("isFeatured", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Trending / Best Seller</p>
                        <p className="text-xs text-slate-500">Mark as trending or best seller.</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" {...register("isTrending")} className="accent-emerald-600" />
                          <span className="text-sm">Trending</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" {...register("isBestSeller")} className="accent-emerald-600" />
                          <span className="text-sm">Best Seller</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                      <input 
                        {...register("metaTitle")} 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                      <input 
                        {...register("metaKeywords")} 
                        placeholder="ayurveda, health, natural..."
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                      <textarea 
                        {...register("metaDescription")} 
                        rows={3}
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                      />
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
