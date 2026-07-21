"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { deleteCoupon } from "@/actions/admin/coupons";
import { Tag, CalendarDays, Percent } from "lucide-react";

export default function CouponsClient({ initialData }: any) {
  const router = useRouter();

  const columns = [
    { 
      key: "code", 
      label: "Coupon Code",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-wide uppercase">{row.code}</div>
            <div className="text-xs text-slate-500 font-medium">Code</div>
          </div>
        </div>
      )
    },
    { 
      key: "discount", 
      label: "Discount",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          {row.discountType === 'percentage' ? (
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              {row.discount}% Off
            </span>
          ) : (
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              ₹{row.discount} Off
            </span>
          )}
        </div>
      )
    },
    { 
      key: "minPurchase", 
      label: "Min. Spend",
      render: (row: any) => (
        <span className="font-medium text-slate-600">
          {row.minPurchase ? `₹${row.minPurchase}` : 'None'}
        </span>
      )
    },
    { 
      key: "expiryDate", 
      label: "Expiry",
      render: (row: any) => {
        if (!row.expiryDate) return <span className="text-slate-500">Never</span>;
        const expiry = new Date(row.expiryDate);
        const isExpired = expiry < new Date();
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarDays className={`w-4 h-4 ${isExpired ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className={`font-medium ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
              {expiry.toLocaleDateString()}
            </span>
          </div>
        );
      }
    },
    {
      key: "isActive",
      label: "Status",
      render: (row: any) => {
        const isActive = row.isActive;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteCoupon(id);
      router.refresh();
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Coupons</h1>
          <p className="text-slate-500 mt-1">Manage discount codes and promotional offers.</p>
        </div>
      </div>
      
      <DataTable
        title="Promotional Codes"
        columns={columns}
        data={initialData}
        searchPlaceholder="Search coupons by code..."
        createHref="/admin/coupons/new"
        onDelete={handleDelete}
      />
    </div>
  );
}
