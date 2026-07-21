"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteCustomer } from "@/actions/admin/customers";
import { User, Mail, Phone } from "lucide-react";

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
    }
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this customer?")) {
      await deleteCustomer(id);
      router.refresh();
    }
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
