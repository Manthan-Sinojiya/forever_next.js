import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICmsSection extends Document {
  title: string;
  type: string;
  subtitle?: string;
  description?: string;
  order: number;
  isEnabled: boolean;
  limit?: number;
  cardStyle?: string;
  buttonText?: string;
  buttonLink?: string;
  slides?: any[];
  content?: any;
  createdAt: Date;
  updatedAt: Date;
}

const CmsSectionSchema = new Schema<ICmsSection>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    order: { type: Number, required: true, default: 0 },
    isEnabled: { type: Boolean, default: true },
    limit: { type: Number },
    cardStyle: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    slides: { type: [Schema.Types.Mixed] },
    content: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const CmsSection = (mongoose.models.CmsSection as Model<ICmsSection>) || mongoose.model<ICmsSection>("CmsSection", CmsSectionSchema);
export default CmsSection;
