"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCustomPageById, updateCustomPage } from "@/actions/admin/customPages";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function EditCustomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contentContent, setContentContent] = useState("");
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: { status: "draft" }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getCustomPageById(id);
      if (res.success && res.data) {
        const d = res.data;
        reset({
          title: d.title || "",
          slug: d.slug || "",
          status: d.status || "draft",
          metaTitle: d.metaTitle || "",
          metaDescription: d.metaDescription || "",
          metaKeywords: d.metaKeywords || ""
        });
        setContentContent(d.content || "");
      } else {
        setError("Failed to load page data.");
      }
      setLoading(false);
    }
    loadData();
  }, [id, reset]);

  const onSubmit = async (data: PageFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const payload = { ...data, content: contentContent || data.content };
      const res = await updateCustomPage(id, payload);
      
      if (res.success) {
        toast.success("Page updated successfully!");
        router.push("/admin/custompages");
      } else {
        setError(res.error || "Failed to update page");
        toast.error(res.error || "Failed to update page");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
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
          <Link href="/admin/custompages" className="text-slate-500 hover:text-slate-900 border p-2 rounded-lg bg-white shadow-sm transition-all"><ArrowLeft className="w-5 h-5"/></Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Page</h1>
            <p className="text-sm text-slate-500 mt-1">Update existing custom page.</p>
          </div>
        </div>
        
        {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input {...register("title")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm outline-none" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <div className="border border-slate-300 rounded-md overflow-hidden">
                    <JoditEditor value={contentContent} config={{ readonly: false }} onBlur={newContent => setContentContent(newContent)} />
                  </div>
                </div>
              </div>
            </div>

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
                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-70 transition-colors">
                    {isSubmitting ? "Updating..." : "Update Page"}
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
