"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBlogById, updateBlog } from "@/actions/admin/blog";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "published"]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contentContent, setContentContent] = useState("");
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: "draft" }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getBlogById(id);
      if (res.success && res.data) {
        const d = res.data;
        reset({
          title: d.title || "",
          slug: d.slug || "",
          excerpt: d.excerpt || "",
          category: d.category || "",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : (d.tags || ""),
          author: d.author || "",
          status: d.status || "draft",
          metaTitle: d.metaTitle || "",
          metaDescription: d.metaDescription || "",
          metaKeywords: d.metaKeywords || ""
        });
        setContentContent(d.content || "");
      } else {
        setError("Failed to load blog data.");
      }
      setLoading(false);
    }
    loadData();
  }, [id, reset]);

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const tagsArray = data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      const payload = { ...data, tags: tagsArray, content: contentContent || data.content };
      const res = await updateBlog(id, payload);
      
      if (res.success) {
        router.push("/admin/blog");
      } else {
        setError(res.error || "Failed to update blog post");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/blog" className="text-slate-500 hover:text-slate-900 border p-2 rounded-lg bg-white shadow-sm transition-all"><ArrowLeft className="w-5 h-5"/></Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Article</h1>
            <p className="text-sm text-slate-500 mt-1">Update existing blog post.</p>
          </div>
        </div>
        
        {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
             {/* General Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input {...register("title")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                  <textarea {...register("excerpt")} rows={4} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <div className="border border-slate-300 rounded-md overflow-hidden">
                    <JoditEditor value={contentContent} config={{ readonly: false }} onBlur={newContent => setContentContent(newContent)} />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">SEO Meta Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                  <input {...register("metaTitle")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                  <textarea {...register("metaDescription")} rows={4} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                  <input {...register("metaKeywords")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Publishing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select {...register("status")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input {...register("slug")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input {...register("category")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <input {...register("tags")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input {...register("author")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-70 transition-colors">
                    {isSubmitting ? "Updating..." : "Update Article"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
