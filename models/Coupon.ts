import mongoose from "mongoose";

export interface ICoupon extends mongoose.Document {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minPurchase: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

const CouponSchema = new mongoose.Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    minPurchase: { type: Number, default: 0 },
    description: { type: String, required: true },
    expiryDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
