import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: "homepage-top" | "homepage-mid";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    position: {
      type: String,
      enum: ["homepage-top", "homepage-mid"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Banner = (mongoose.models.Banner as Model<IBanner>) || mongoose.model<IBanner>("Banner", BannerSchema);
export default Banner;
