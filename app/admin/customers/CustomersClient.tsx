"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteCustomer } from "@/actions/admin/customers";
import { User, Mail, Phone, Eye } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CustomersClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  
  const columns = [
    { 
      key: "name", 
      label: "Customer",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
            {row.name ? row.name.charAt(0) : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name || "Guest User"}</div>
            <div className="text-xs text-slate-500 font-medium">Customer ID: #{row._id?.slice(-6).toUpperCase()}</div>
          </div>
        </div>
      )
    },
    { 
      key: "contact", 
      label: "Contact Info",
      render: (row: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {row.email || "No email"}
          </div>
          {row.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Phone className="w-3 h-3 text-slate-400" />
              {row.phone}
            </div>
          )}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => {
        const isActive = row.status !== 'inactive';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row: any) => (
        <span className="text-slate-500 font-medium">{new Date(row.createdAt || new Date()).toLocaleDateString()}</span>
      )
    },
    {
      key: "actions",
      label: "View",
      render: (row: any) => (
        <Link href={`/admin/customers/${row._id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
        </Link>
      )
    }
  ];

  const handleDelete = (id: string) => {
    toast((t) => (
      <div>
        <p className="font-medium mb-3">Are you sure you want to remove this customer?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Removing customer...");
              try {
                await deleteCustomer(id);
                toast.success("Customer removed successfully", { id: loadingToast });
                router.refresh();
              } catch (error) {
                toast.error("Failed to remove customer", { id: loadingToast });
              }
            }}
          >
            Remove
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 mt-1">View and manage your store's registered customers.</p>
        </div>
      </div>
      
      <DataTable
        title="Customer Directory"
        columns={columns}
        data={initialData}
        onDelete={handleDelete}
        searchPlaceholder="Search by name, email, or phone..."
      />
    </div>
  );
}
