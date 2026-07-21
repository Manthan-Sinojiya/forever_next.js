"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteCategory } from "@/actions/admin/categories";
import { Layers } from "lucide-react";

export default function CategoriesClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  
  const columns = [
    { 
      key: "name", 
      label: "Category Name",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-500 overflow-hidden flex-shrink-0">
            {row.image ? (
              <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500 font-medium">/{row.slug}</div>
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => {
        const isActive = row.status === 'active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {isActive ? 'Active' : 'Draft'}
          </span>
        );
      }
    },
    {
      key: "productsCount",
      label: "Products",
      render: (row: any) => (
        <span className="font-medium text-slate-600">{row.productsCount || 0} items</span>
      )
    }
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      router.refresh();
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Organize your products into distinct categories.</p>
        </div>
      </div>
      
      <DataTable
        title="Product Categories"
        columns={columns}
        data={initialData}
        createHref="/admin/categories/new"
        onDelete={handleDelete}
        searchPlaceholder="Search categories..."
      />
    </div>
  );
}
