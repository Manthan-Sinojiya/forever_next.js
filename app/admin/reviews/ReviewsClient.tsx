"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteReview, updateReviewStatus } from "@/actions/admin/reviews";
import { MessageSquare, Star } from "lucide-react";

export default function ReviewsClient({ initialData }: any) {
  const router = useRouter();

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    await updateReviewStatus(id, newStatus);
    router.refresh();
  };

  const columns = [
    { 
      key: "userName", 
      label: "Reviewer",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
            {row.userName ? row.userName.charAt(0) : <MessageSquare className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.userName || "Anonymous"}</div>
            <div className="text-xs text-slate-500 font-medium">Review ID: #{row._id?.slice(-6).toUpperCase()}</div>
          </div>
        </div>
      )
    },
    { 
      key: "rating", 
      label: "Rating",
      render: (row: any) => (
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 w-fit px-2 py-1 rounded-md">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="font-bold text-sm">{row.rating}</span>
        </div>
      )
    },
    { 
      key: "comment", 
      label: "Comment",
      render: (row: any) => (
        <div className="max-w-[250px] truncate text-sm text-slate-600 font-medium" title={row.comment}>
          {row.comment}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const status = row.status || "pending";
        const isApproved = status === "approved";
        return (
          <button
            onClick={() => handleStatusChange(row._id, status)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:shadow-sm ${
              isApproved 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {status}
          </button>
        );
      },
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      router.refresh();
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Reviews</h1>
          <p className="text-slate-500 mt-1">Manage and moderate customer reviews and ratings.</p>
        </div>
      </div>
      
      <DataTable
        title="Customer Feedback"
        columns={columns}
        data={initialData}
        searchPlaceholder="Search reviews by customer name..."
        onDelete={handleDelete}
      />
    </div>
  );
}
