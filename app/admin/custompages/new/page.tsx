"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomPage } from "@/actions/admin/customPages";

import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save } from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const customPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  bannerImage: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type CustomPageFormValues = z.infer<typeof customPageSchema>;

export default function NewCustomPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CustomPageFormValues>({
    resolver: zodResolver(customPageSchema),
    defaultValues: {
      status: "draft",
    }
  });

  const [contentValue, setContentValue] = useState("");
  const bannerImage = watch("bannerImage");

  const onSubmit = async (data: CustomPageFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await createCustomPage({ ...data, content: contentValue });
      if (res.success) {
        router.push("/admin/custompages");
      } else {
        setError(res.error || "Failed to create custom page");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create Static Page</h1>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:bg-emerald-700 disabled:opacity-70 font-medium transition-colors"
        >
          <Save size={18} />
          {isSubmitting ? "Creating..." : "Save Page"}
        </button>
      </div>
      
      {error && <div className="text-red-500 bg-red-50 p-3 rounded-md border border-red-100 mb-6">{error}</div>}
      
      <form id="custom-page-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Page Title *</label>
              <input {...register("title")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug (URL) *</label>
              <input {...register("slug")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Banner Image</label>
              <ImageUpload 
                value={bannerImage}
                onChange={(url) => setValue("bannerImage", url)}
                label=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select {...register("status")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-800 mb-4">Page Content</label>
          <div className="border border-slate-300 rounded-md overflow-hidden">
            <JoditEditor
              value={contentValue}
              config={{ readonly: false, minHeight: 400 }}
              onBlur={newContent => setContentValue(newContent)}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">SEO Meta Tags</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Title</label>
            <input {...register("seoTitle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Keywords</label>
            <input {...register("seoKeywords")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
            <textarea {...register("seoDescription")} rows={3} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
        </div>

      </form>
    </div>
  );
}
