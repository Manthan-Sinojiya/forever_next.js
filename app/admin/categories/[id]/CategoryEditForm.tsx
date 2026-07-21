"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategory } from "@/actions/admin/categories";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryEditForm({ initialData, id }: { initialData: any, id: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData.name || "",
      slug: initialData.slug || "",
      description: initialData.description || "",
      status: initialData.status || "draft",
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await updateCategory(id, data);
      if (res.success) {
        router.push("/admin/categories");
      } else {
        setError(res.error || "Failed to update category");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input {...register("name")} className="w-full border border-gray-300 rounded p-2" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input {...register("slug")} className="w-full border border-gray-300 rounded p-2" />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register("description")} className="w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="w-full border border-gray-300 rounded p-2">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}
