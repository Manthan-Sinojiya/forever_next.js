import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Snapshot of price at the time of adding
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  coupon?: mongoose.Types.ObjectId;
  discountAmount: number;
  finalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (mongoose.models.Cart as Model<ICart>) || mongoose.model<ICart>("Cart", CartSchema);
