"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCoupon } from "@/actions/admin/coupons";
import { Save } from "lucide-react";

const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discount: z.number().min(0, "Discount must be positive"),
  discountType: z.enum(["percentage", "fixed"]),
  minPurchase: z.number().min(0),
  description: z.string().min(1, "Description is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  isActive: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function NewCouponPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: "percentage",
      isActive: true,
      minPurchase: 0,
      discount: 0,
    }
  });

  const onSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await createCoupon(data);
      if (res.success) {
        router.push("/admin/coupons");
      } else {
        setError(res.error || "Failed to create coupon");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create Coupon</h1>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:bg-emerald-700 disabled:opacity-70 font-medium transition-colors"
        >
          <Save size={18} />
          {isSubmitting ? "Creating..." : "Save Coupon"}
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-50 p-3 rounded-md border border-red-100 mb-6">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Coupon Code *</label>
          <input {...register("code")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm uppercase" placeholder="e.g. SUMMER50" />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Amount *</label>
            <input type="number" {...register("discount", { valueAsNumber: true })} className="w-full border border-slate-300 rounded-md p-2.5 text-sm" />
            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Type</label>
            <select {...register("discountType")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Purchase (₹)</label>
            <input type="number" {...register("minPurchase", { valueAsNumber: true })} className="w-full border border-slate-300 rounded-md p-2.5 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date *</label>
            <input type="date" {...register("expiryDate")} className="w-full border border-slate-300 rounded-md p-2.5 text-sm" />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
          <textarea {...register("description")} rows={3} className="w-full border border-slate-300 rounded-md p-2.5 text-sm" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-md border border-slate-100">
          <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
          <label className="text-sm font-medium text-slate-700">Coupon is Active</label>
        </div>

      </form>
    </div>
  );
}
