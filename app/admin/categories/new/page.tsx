"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategory } from "@/actions/admin/categories";
import { ImageUpload } from "@/components/admin/ImageUpload";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
  metaTitle: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaDescription: z.string().optional(),
  imageAlt: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: "draft",
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = { ...data, image };
      const res = await createCategory(payload);
      if (res.success) {
        router.push("/admin/categories");
      } else {
        setError(res.error || "Failed to create category");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200  ">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input {...register("name")} className="w-full border border-gray-300 rounded p-2  " />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input {...register("slug")} className="w-full border border-gray-300 rounded p-2  " />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register("description")} className="w-full border border-gray-300 rounded p-2  " />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="w-full border border-gray-300 rounded p-2  ">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="pt-4 border-t border-gray-200 mt-4">
          <h3 className="text-lg font-bold mb-4">Media</h3>
          <div className="w-48 mb-4">
            <ImageUpload 
              value={image}
              onChange={setImage}
              label="Category Image"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image Alt Text (SEO)</label>
            <input {...register("imageAlt")} className="w-full border border-gray-300 rounded p-2" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 mt-4">
          <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input {...register("metaTitle")} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input {...register("metaKeywords")} placeholder="e.g. natural, ayurveda..." className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea {...register("metaDescription")} rows={3} className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}
