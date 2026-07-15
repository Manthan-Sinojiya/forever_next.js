import mongoose from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IOrder extends mongoose.Document {
  orderNumber: string;
  userEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Pending" | "Dispatched" | "Delivered" | "Cancelled";
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  couponCode?: string | null;
  discountAmount?: number;
  createdAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    couponCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
