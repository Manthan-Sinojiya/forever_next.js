import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICustomPage extends Document {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  bannerImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  status: "draft" | "published";
  publishDate?: Date;
  showInNavigation: boolean;
  showInFooter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomPageSchema = new Schema<ICustomPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    bannerImage: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishDate: { type: Date },
    showInNavigation: { type: Boolean, default: false },
    showInFooter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CustomPage = (mongoose.models.CustomPage as Model<ICustomPage>) || mongoose.model<ICustomPage>("CustomPage", CustomPageSchema);
export default CustomPage;
