"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { deleteCustomPage, createCustomPage } from "@/actions/admin/customPages";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "URL slug is required"),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomPagesClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const columns = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "status", header: "Status" },
  ];

  const handleGlobalFilterChange = (search: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePaginationChange = (updater: any) => {
    const nextState = typeof updater === "function" ? updater({ pageIndex: initialPage - 1, pageSize: 10 }) : updater;
    const params = new URLSearchParams();
    if (initialSearch) params.set("search", initialSearch);
    params.set("page", (nextState.pageIndex + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this custom page?")) {
      await deleteCustomPage(id);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, content: content || data.content, status: "published" };
      await createCustomPage(payload as any);
      setIsModalOpen(false);
      reset();
      setContent("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save page");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={initialData}
        pageCount={totalPages}
        onAdd={() => setIsModalOpen(true)}
        onDelete={handleDelete}
        onGlobalFilterChange={handleGlobalFilterChange}
        onPaginationChange={handlePaginationChange}
        globalFilter={initialSearch}
        pagination={{ pageIndex: initialPage - 1, pageSize: 10 }}
        searchKey="title"
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Add Simple Page</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-page-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    {...register("title")}
                    className="w-full border border-emerald-400 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-shadow" 
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                  <input 
                    {...register("slug")}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Example: privacy, about-us, refund</p>
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <div className="border border-slate-300 rounded-md overflow-hidden">
                    <JoditEditor
                      value={content}
                      config={{ readonly: false, placeholder: "Start writing..." }}
                      onBlur={newContent => setContent(newContent)}
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button 
                form="add-page-form"
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
