"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { deleteContactMessage } from "@/actions/admin/contact";
import { toast } from "react-hot-toast";
import { User, CalendarDays, Eye } from "lucide-react";
import Link from "next/link";

export default function ContactClient({ data }: { data: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setLoading(id);
    try {
      const res = await deleteContactMessage(id);
      if (res.success) {
        toast.success("Message deleted");
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting message");
    } finally {
      setLoading(null);
    }
  };

  const columns = [
    {
      key: "fullName",
      label: "Sender",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
            {row.fullName ? row.fullName.charAt(0) : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.fullName || "Anonymous"}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "subject",
      label: "Subject",
      render: (row: any) => (
        <span className="font-medium text-slate-700">{row.subject}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const status = row.status as string;
        let color = "bg-slate-100 text-slate-700 border-slate-200";
        let dotColor = "bg-slate-400";
        
        if (status === "new") {
          color = "bg-blue-50 text-blue-700 border-blue-200";
          dotColor = "bg-blue-500";
        } else if (status === "replied") {
          color = "bg-emerald-50 text-emerald-700 border-emerald-200";
          dotColor = "bg-emerald-500";
        }

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color} capitalize`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
            {status}
          </span>
        );
      }
    },
    {
      key: "createdAt",
      label: "Date Received",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: "actions",
      label: "",
      render: (row: any) => (
        <Link 
          href={`/admin/contact/${row._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>
      )
    }
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contact Messages</h1>
          <p className="text-slate-500 mt-1">View and respond to inquiries from customers.</p>
        </div>
      </div>
      
      <DataTable 
        title="Inbox"
        columns={columns} 
        data={data} 
        searchPlaceholder="Search messages by email..." 
        onDelete={handleDelete}
      />
    </div>
  );
}
