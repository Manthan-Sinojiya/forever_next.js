import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  topBannerImage?: string;
  topBannerLink?: string;
  bottomBannerImage?: string;
  bottomBannerLink?: string;
  customCSS?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: "" },
    topBannerImage: { type: String },
    topBannerLink: { type: String },
    bottomBannerImage: { type: String },
    bottomBannerLink: { type: String },
    customCSS: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Page as Model<IPage>) || mongoose.model<IPage>("Page", PageSchema);
