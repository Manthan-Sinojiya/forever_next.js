"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettings } from "@/actions/admin/settings";

const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  supportEmail: z.string().email("Invalid email address"),
  supportPhone: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  favicon: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  announcement: z.object({
    show: z.boolean(),
    text: z.string().optional(),
    behavior: z.string().optional(),
    bg: z.string().optional(),
    color: z.string().optional(),
  }),
  ui: z.object({
    productCardStyle: z.string(),
    categoryCardStyle: z.string(),
    testimonialStyle: z.string(),
    blogCardStyle: z.string(),
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: initialData?.storeName || "",
      supportEmail: initialData?.supportEmail || initialData?.storeEmail || "",
      supportPhone: initialData?.supportPhone || initialData?.storePhone || "",
      currency: initialData?.currency || "INR",
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      socialLinks: {
        facebook: initialData?.socialLinks?.facebook || "",
        instagram: initialData?.socialLinks?.instagram || "",
        whatsapp: initialData?.socialLinks?.whatsapp || "",
      },
      announcement: {
        show: true,
        text: "100% Ayurvedic | Free Shipping on Orders ₹499+",
        behavior: "static",
        bg: "#059669",
        color: "#ffffff",
      },
      ui: {
        productCardStyle: "style1",
        categoryCardStyle: "style1",
        testimonialStyle: "style1",
        blogCardStyle: "style1",
      }
    }
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await updateSettings(data as any);
      if (res.success) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update settings" });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Site Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your store's global configuration and SEO defaults.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* General Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">General Information</h3>
            <p className="text-sm text-slate-500">Basic details about your store.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
            <input {...register("storeName")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
            {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
            <input type="email" {...register("supportEmail")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
            {errors.supportEmail && <p className="text-red-500 text-xs mt-1">{errors.supportEmail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Support Phone</label>
            <input {...register("supportPhone")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency Code</label>
            <input {...register("currency")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>
        </div>

        {/* Default SEO & Social */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Default SEO & Social</h3>
            <p className="text-sm text-slate-500">Global metadata and social links.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global SEO Title</label>
            <input {...register("seoTitle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global SEO Description</label>
            <textarea {...register("seoDescription")} rows={3} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
            <input {...register("socialLinks.facebook")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
            <input {...register("socialLinks.instagram")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
            <input {...register("socialLinks.whatsapp")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
          </div>
        </div>
      </div>

      {/* Storefront Announcement */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Storefront Announcement</h3>
          <p className="text-sm text-slate-500">Manage the top announcement bar visible on all pages.</p>
        </div>
        
        <div className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <div>
            <div className="font-medium text-slate-800">Show Announcement Bar</div>
            <div className="text-sm text-slate-500">Display the top announcement banner on the storefront.</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register("announcement.show")} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Announcement Text</label>
          <input {...register("announcement.text")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Behavior</label>
            <select {...register("announcement.behavior")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-shadow">
              <option value="static">static</option>
              <option value="marquee">marquee</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Colors</label>
            <div className="flex items-center gap-4 h-10">
              <div className="flex items-center gap-2">
                <input type="color" {...register("announcement.bg")} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-sm text-slate-700">Background</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="color" {...register("announcement.color")} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" />
                <span className="text-sm text-slate-700">Text</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UI Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">UI Preferences</h3>
          <p className="text-sm text-slate-500">Select the visual style for different cards across the storefront.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Card Style</label>
            <select {...register("ui.productCardStyle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
              <option value="style1">style1</option>
              <option value="style2">style2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category Card Style</label>
            <select {...register("ui.categoryCardStyle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
              <option value="style1">style1</option>
              <option value="style2">style2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Testimonial Style</label>
            <select {...register("ui.testimonialStyle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
              <option value="style1">style1</option>
              <option value="style2">style2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Blog Card Style</label>
            <select {...register("ui.blogCardStyle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
              <option value="style1">style1</option>
              <option value="style2">style2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-emerald-700 disabled:opacity-70 font-medium transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
