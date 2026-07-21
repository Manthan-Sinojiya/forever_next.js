import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICustomPage extends Document {
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const CustomPageSchema = new Schema<ICustomPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    seoTitle: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export const CustomPage = (mongoose.models.CustomPage as Model<ICustomPage>) || mongoose.model<ICustomPage>("CustomPage", CustomPageSchema);
export default CustomPage;
