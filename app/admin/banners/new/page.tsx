"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBanner } from "@/actions/admin/banners";
import { ImageUpload } from "@/components/admin/ImageUpload";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  position: z.enum(["Homepage", "Category", "Product"]),
  status: z.enum(["Active", "Inactive"]),
  priority: z.number().min(0).optional(),
  
  image: z.string().min(1, "Desktop image is required"),
  desktopAlt: z.string().optional(),
  
  tabletImage: z.string().optional(),
  tabletAlt: z.string().optional(),
  
  mobileImage: z.string().optional(),
  mobileAlt: z.string().optional(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export default function NewBannerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, control, formState: { errors } } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      position: "Homepage",
      status: "Active",
      priority: 0,
      image: "",
      mobileImage: "",
    }
  });

  const onSubmit = async (data: BannerFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      // Map to old schema structure if needed, or pass full data
      const payload = {
        title: data.title,
        image: data.image,
        mobileImage: data.mobileImage,
        link: data.buttonUrl,
        position: data.position === "Homepage" ? "homepage-top" : "homepage-mid",
        isActive: data.status === "Active",
      };
      
      const res = await createBanner(payload as any);
      
      if (res.success) {
        router.push("/admin/banners");
      } else {
        setError(res.error || "Failed to create banner");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">New Banner</h1>
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
              {isSubmitting ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </div>
        
        {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Content Section */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input 
                    {...register("title")} 
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <input 
                    {...register("subtitle")} 
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                    <input 
                      {...register("buttonText")} 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button URL</label>
                    <input 
                      {...register("buttonUrl")} 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Settings & Context Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Settings & Context</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
                    <select 
                      {...register("position")} 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-shadow"
                    >
                      <option value="Homepage">Homepage</option>
                      <option value="Category">Category</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                    <select 
                      {...register("status")} 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-shadow"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority (Higher = First)</label>
                  <input 
                    type="number"
                    {...register("priority", { valueAsNumber: true })} 
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Desktop Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Desktop Image *</label>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload 
                        label="Choose File" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    )}
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>
                <input 
                  {...register("desktopAlt")} 
                  placeholder="Alt tag"
                  className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow mt-2" 
                />
              </div>

              {/* Tablet Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Tablet Image</label>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                  <Controller
                    control={control}
                    name="tabletImage"
                    render={({ field }) => (
                      <ImageUpload 
                        label="Choose File" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    )}
                  />
                </div>
                <input 
                  {...register("tabletAlt")} 
                  placeholder="Alt tag"
                  className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow mt-2" 
                />
              </div>

              {/* Mobile Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Mobile Image</label>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                  <Controller
                    control={control}
                    name="mobileImage"
                    render={({ field }) => (
                      <ImageUpload 
                        label="Choose File" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    )}
                  />
                </div>
                <input 
                  {...register("mobileAlt")} 
                  placeholder="Alt tag"
                  className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow mt-2" 
                />
              </div>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
