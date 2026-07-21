import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISetting extends Document {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    storeName: { type: String, required: true },
    storeEmail: { type: String, required: true },
    storePhone: { type: String },
    currency: { type: String, default: "USD" },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    address: { type: String },
  },
  { timestamps: true }
);

export const Setting = (mongoose.models.Setting as Model<ISetting>) || mongoose.model<ISetting>("Setting", SettingSchema);
export default Setting;
