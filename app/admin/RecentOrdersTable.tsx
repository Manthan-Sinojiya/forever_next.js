"use client";

import { DataTable } from "@/components/admin/DataTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentOrdersTableProps {
  orders: any[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const recentOrdersColumns = [
    { key: "id", label: "Order ID", render: (row: any) => <span className="font-medium text-slate-900">#{row.id.slice(-6)}</span> },
    { key: "customer", label: "Customer" },
    { key: "total", label: "Total", render: (row: any) => <span className="font-medium">₹{row.total.toLocaleString()}</span> },
    { key: "status", label: "Status", render: (row: any) => {
        let styles = 'bg-slate-100 text-slate-700 border-slate-200';
        let dot = 'bg-slate-400';
        
        if (row.status === 'completed') {
            styles = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            dot = 'bg-emerald-500';
        } else if (row.status === 'processing') {
            styles = 'bg-blue-50 text-blue-700 border-blue-200/60';
            dot = 'bg-blue-500';
        } else if (row.status === 'shipped') {
            styles = 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
            dot = 'bg-indigo-500';
        } else if (row.status === 'cancelled') {
            styles = 'bg-rose-50 text-rose-700 border-rose-200/60';
            dot = 'bg-rose-500';
        } else if (row.status === 'pending') {
            styles = 'bg-amber-50 text-amber-700 border-amber-200/60';
            dot = 'bg-amber-500';
        }

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${styles}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
            {row.status}
          </div>
        );
    } },
    { key: "date", label: "Date", render: (row: any) => <span className="text-slate-500">{new Date(row.date).toLocaleDateString()}</span> },
  ];

  return (
    <DataTable 
      title="" 
      data={orders.slice(0, 5)} 
      columns={recentOrdersColumns} 
      searchPlaceholder="Search recent orders..."
    />
  );
}
