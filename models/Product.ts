import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string;
  category?: mongoose.Types.ObjectId;
  subCategory?: string;
  brand?: mongoose.Types.ObjectId;
  tags: string[];
  
  // Pricing & Stock
  mrp: number; // compareAtPrice
  price: number; // salePrice
  gst?: number;
  inventory: number;
  inStock: boolean;
  
  // Physical Details
  weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // CMS Fields (Healthcare specific)
  description?: string;
  shortDescription?: string;
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  storage?: string;
  
  thumbnail?: string;
  thumbnailAlt?: string;
  images: {
    url: string;
    publicId?: string;
    alt?: string;
  }[];
  video?: string;
  
  // Marketing & Flags
  status: "active" | "draft" | "archived";
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  todayDeal: boolean;
  
  // Variants
  variants: {
    attribute: string; // e.g., 'Size', 'Color', 'Flavor'
    value: string;     // e.g., '500g', 'Red', 'Chocolate'
    price: number;
    inventory: number;
    sku?: string;
  }[];
  
  // Relations
  relatedProducts: mongoose.Types.ObjectId[];
  crossSellProducts: mongoose.Types.ObjectId[];
  upSellProducts: mongoose.Types.ObjectId[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    tags: [{ type: String }],
    
    mrp: { type: Number, required: true },
    price: { type: Number },
    gst: { type: Number },
    inventory: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    
    weight: { type: String },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    
    description: { type: String },
    shortDescription: { type: String },
    ingredients: { type: String },
    benefits: { type: String },
    howToUse: { type: String },
    storage: { type: String },
    
    thumbnail: { type: String },
    thumbnailAlt: { type: String },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String },
      },
    ],
    video: { type: String },
    
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    todayDeal: { type: Boolean, default: false },
    
    variants: [
      {
        attribute: { type: String },
        value: { type: String },
        price: { type: Number },
        inventory: { type: Number, default: 0 },
        sku: { type: String }
      }
    ],
    
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    crossSellProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    upSellProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export { Product };
export default Product;
