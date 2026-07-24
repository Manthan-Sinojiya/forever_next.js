import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userEmail: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  paymentMethod: string;
  paymentDetails?: any;
  paymentStatus: "pending" | "paid";
  orderStatus: "pending" | "shipping" | "done";
  trackingNumber?: string;
  deliveryPartner?: string;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    paymentMethod: { type: String, required: true },
    paymentDetails: { type: Schema.Types.Mixed },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipping", "done"],
      default: "pending",
    },
    trackingNumber: { type: String },
    deliveryPartner: { type: String },
    trackingUrl: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
