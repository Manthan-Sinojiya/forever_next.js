import mongoose from "mongoose";

export interface IMedia extends mongoose.Document {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new mongoose.Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    format: { type: String },
    resourceType: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
