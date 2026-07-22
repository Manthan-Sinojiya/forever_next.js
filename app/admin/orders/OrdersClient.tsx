"use client";

import { useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteOrder } from "@/actions/admin/orders";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function OrdersClient({ initialData, totalPages, initialPage, initialSearch }: any) {
  const router = useRouter();
  const pathname = usePathname();
  
  const columns = [
    { 
      key: "orderNumber", 
      label: "Order ID",
      render: (row: any) => (
        <span className="font-semibold text-slate-900">
          #{row.orderNumber || row._id?.slice(-6).toUpperCase()}
        </span>
      )
    },
    { 
      key: "customerName", 
      label: "Customer",
      render: (row: any) => (
        <div className="font-medium text-slate-700">{row.shippingAddress?.fullName || row.customerName || (row.customer && row.customer.name) || "Guest"}</div>
      )
    },
    {
      key: "products",
      label: "Products",
      render: (row: any) => (
        <div className="text-sm text-slate-600 max-w-[200px] truncate">
          {row.items?.map((item: any) => item.name).join(", ") || "No items"}
        </div>
      )
    },
    { 
      key: "total", 
      label: "Total",
      render: (row: any) => (
        <span className="font-semibold text-slate-900">₹{(row.total || 0).toLocaleString()}</span>
      )
    },
    { 
      key: "orderStatus", 
      label: "Status",
      render: (row: any) => {
        const status = (row.orderStatus || 'pending').toLowerCase();
        let styles = 'bg-slate-100 text-slate-700 border-slate-200';
        let dot = 'bg-slate-400';
        
        if (status === 'done' || status === 'delivered' || status === 'completed') {
            styles = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            dot = 'bg-emerald-500';
        } else if (status === 'shipping' || status === 'shipped') {
            styles = 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
            dot = 'bg-indigo-500';
        } else if (status === 'cancelled') {
            styles = 'bg-rose-50 text-rose-700 border-rose-200/60';
            dot = 'bg-rose-500';
        } else if (status === 'pending' || status === 'processing') {
            styles = 'bg-amber-50 text-amber-700 border-amber-200/60';
            dot = 'bg-amber-500';
        }

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${styles}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
            {status}
          </div>
        );
      }
    },
    {
      key: "date",
      label: "Date",
      render: (row: any) => (
        <span className="text-slate-500">{new Date(row.createdAt || new Date()).toLocaleDateString()}</span>
      )
    },
    {
      key: "actions",
      label: "View",
      render: (row: any) => (
        <Link href={`/admin/orders/${row._id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
        </Link>
      )
    }
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
      router.refresh();
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-1">Manage and track customer orders across your store.</p>
        </div>
      </div>
      
      <DataTable
        title="Recent Orders"
        columns={columns}
        data={initialData}
        onDelete={handleDelete}
        searchPlaceholder="Search by order ID or customer name..."
      />
    </div>
  );
}
