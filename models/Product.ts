import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProductSize {
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
}

export interface IProduct extends Document {
  name: string;
  slug?: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId | string;
  brand?: mongoose.Types.ObjectId | string;
  imageUrl: string;
  imageGallery?: string[];
  videoUrl?: string;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  rating: number;
  numReviews: number;
  todayDeal: boolean;
  originalPrice?: number;
  sizes?: IProductSize[];
  
  highlights?: string[];
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  whoShouldUse?: string;
  nutritionTable?: Record<string, string>;
  
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  imageAlt?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, sparse: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.Mixed, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    imageUrl: { type: String, required: true },
    imageGallery: { type: [String], default: [] },
    videoUrl: { type: String },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    todayDeal: { type: Boolean, default: false },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5 },
    numReviews: { type: Number, default: 0 },
    sizes: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          originalPrice: { type: Number },
          stock: { type: Number, default: 0 },
        }
      ],
      default: []
    },
    highlights: { type: [String], default: [] },
    ingredients: { type: String },
    benefits: { type: String },
    howToUse: { type: String },
    whoShouldUse: { type: String },
    nutritionTable: { type: Schema.Types.Mixed },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    imageAlt: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
