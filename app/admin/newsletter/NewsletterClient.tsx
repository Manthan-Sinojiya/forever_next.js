"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { deleteSubscriber } from "@/actions/admin/newsletter";
import { toast } from "react-hot-toast";
import { Mail, CalendarDays } from "lucide-react";

interface NewsletterClientProps {
  data: any[];
}

export default function NewsletterClient({ data }: NewsletterClientProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    setLoading(id);
    try {
      const res = await deleteSubscriber(id);
      if (res.success) {
        toast.success("Subscriber removed successfully");
      } else {
        toast.error(res.error || "Failed to remove subscriber");
      }
    } catch {
      toast.error("Error removing subscriber");
    } finally {
      setLoading(null);
    }
  };

  const columns = [
    {
      key: "email",
      label: "Subscriber",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const isSubscribed = row.status === "subscribed";
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isSubscribed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
            {isSubscribed ? 'Subscribed' : 'Unsubscribed'}
          </span>
        );
      }
    },
    {
      key: "createdAt",
      label: "Joined On",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Newsletter Subscribers</h1>
          <p className="text-slate-500 mt-1">Manage your email marketing audience.</p>
        </div>
      </div>
      
      <DataTable 
        title="Audience List"
        columns={columns} 
        data={data} 
        searchPlaceholder="Search subscribers by email..." 
        onDelete={handleDelete}
      />
    </div>
  );
}
