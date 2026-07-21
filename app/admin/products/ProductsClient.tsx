"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteProduct } from "@/actions/admin/products";

export default function ProductsClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  
  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            {row.images && row.images.length > 0 ? (
              <img src={row.images[0].url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500 font-medium">{row.sku || "No SKU"}</div>
          </div>
        </div>
      )
    },
    { 
      key: "price", 
      label: "Price",
      render: (row: any) => (
        <span className="font-medium text-slate-700">₹{row.price?.toLocaleString()}</span>
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
      key: "inventory", 
      label: "Inventory",
      render: (row: any) => (
        <span className={`font-medium ${row.inventory < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
          {row.inventory} in stock
        </span>
      )
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      router.refresh();
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your store's inventory, pricing, and product details.</p>
        </div>
      </div>
      
      <DataTable
        title="All Products"
        columns={columns}
        data={initialData}
        createHref="/admin/products/new"
        onDelete={handleDelete}
        searchPlaceholder="Search products by name or SKU..."
      />
    </div>
  );
}
