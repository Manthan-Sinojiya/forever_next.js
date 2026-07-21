"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { deleteFaq, createFaq } from "@/actions/admin/faqs";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function FaqsClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  
  const columns = [
    { accessorKey: "order", header: "Order" },
    { accessorKey: "question", header: "Question" },
    { accessorKey: "category", header: "Category" },
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
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq(id);
      router.refresh();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createFaq({ ...data, order: 0 } as any);
      setIsModalOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save FAQ");
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
        searchKey="question"
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Add FAQ</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <form id="add-faq-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                  <input 
                    {...register("question")}
                    className="w-full border border-emerald-400 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-shadow" 
                  />
                  {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                  <textarea 
                    {...register("answer")}
                    rows={4}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                  {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input 
                    {...register("category")}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" 
                  />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button 
                form="add-faq-form"
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
