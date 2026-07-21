import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  author?: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: String },
    tags: { type: [String], default: [] },
    author: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const Blog = (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
