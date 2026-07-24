import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  tabletImage?: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  position:
    | "homepage-top"
    | "homepage-mid"
    | "about-us"
    | "categories-overview"
    | "category-specific"
    | "products-overview"
    | "product-specific"
    | "promotional"
    | "Homepage"
    | "Category"
    | "Product";
  targetCategory?: string; // Category ID, slug or name
  targetProduct?: string;  // Product ID or slug
  isActive: boolean;
  priority: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    tabletImage: { type: String },
    mobileImage: { type: String },
    link: { type: String },
    buttonText: { type: String },
    position: {
      type: String,
      required: true,
    },
    targetCategory: { type: String },
    targetProduct: { type: String },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export const Banner = (mongoose.models.Banner as Model<IBanner>) || mongoose.model<IBanner>("Banner", BannerSchema);
export default Banner;

