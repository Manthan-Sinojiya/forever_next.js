import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  parentCategory?: mongoose.Types.ObjectId;
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    imageAlt: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    status: { type: String, enum: ["active", "draft", "archived"], default: "draft" },
  },
  { timestamps: true }
);

export const Category = (mongoose.models.Category as Model<ICategory>) || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
