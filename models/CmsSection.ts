import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICmsSection extends Document {
  sectionName: string;
  type: "hero" | "grid" | "carousel";
  order: number;
  isActive: boolean;
  content?: any;
  createdAt: Date;
  updatedAt: Date;
}

const CmsSectionSchema = new Schema<ICmsSection>(
  {
    sectionName: { type: String, required: true },
    type: { type: String, enum: ["hero", "grid", "carousel"], required: true },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const CmsSection = (mongoose.models.CmsSection as Model<ICmsSection>) || mongoose.model<ICmsSection>("CmsSection", CmsSectionSchema);
export default CmsSection;
