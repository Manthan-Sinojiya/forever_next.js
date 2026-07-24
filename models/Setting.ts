import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISetting extends Document {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  tax: number;
  shippingConfig: any;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    youtube?: string;
    linkedin?: string;
  };
  address: string;
  logo?: string;
  favicon?: string;
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  announcement?: {
    show: boolean;
    text?: string;
    behavior?: string;
    bg?: string;
    color?: string;
  };
  ui?: {
    productCardStyle?: string;
    categoryCardStyle?: string;
    testimonialStyle?: string;
    blogCardStyle?: string;
  };
  smtp?: any;
  razorpay?: {
    keyId?: string;
    keySecret?: string;
    enabled?: boolean;
  };
  googleAnalytics?: string;
  facebookPixel?: string;
  
  // Footer Builder
  footerAboutText?: string;
  footerQuickLinks?: mongoose.Types.ObjectId; // Ref to Menu
  footerPolicyLinks?: mongoose.Types.ObjectId; // Ref to Menu
  footerCategories?: mongoose.Types.ObjectId; // Ref to Menu
  footerCopyrightText?: string;
  showNewsletter?: boolean;
  paymentIcons?: string[];

  // Global SEO
  globalMetaTitle?: string;
  globalMetaDescription?: string;
  globalKeywords?: string;
  globalOgImage?: string;
  globalRobots?: string;
  globalJsonLd?: string;

  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    storeName: { type: String, required: true },
    storeEmail: { type: String, required: true },
    storePhone: { type: String },
    currency: { type: String, default: "INR" },
    tax: { type: Number, default: 0 },
    shippingConfig: { type: Schema.Types.Mixed },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      whatsapp: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
    },
    address: { type: String },
    logo: { type: String },
    favicon: { type: String },
    themeColors: {
      primary: { type: String, default: "#43B97F" },
      secondary: { type: String, default: "#1E5AA8" },
      accent: { type: String, default: "#2A75C3" },
    },
    announcement: {
      show: { type: Boolean, default: true },
      text: { type: String },
      behavior: { type: String, default: "static" },
      bg: { type: String },
      color: { type: String }
    },
    ui: {
      productCardStyle: { type: String, default: "style1" },
      categoryCardStyle: { type: String, default: "style1" },
      testimonialStyle: { type: String, default: "style1" },
      blogCardStyle: { type: String, default: "style1" }
    },
    smtp: { type: Schema.Types.Mixed },
    razorpay: {
      keyId: { type: String },
      keySecret: { type: String },
      enabled: { type: Boolean, default: false }
    },
    googleAnalytics: { type: String },
    facebookPixel: { type: String },
    
    footerAboutText: { type: String },
    footerQuickLinks: { type: Schema.Types.ObjectId, ref: "Menu" },
    footerPolicyLinks: { type: Schema.Types.ObjectId, ref: "Menu" },
    footerCategories: { type: Schema.Types.ObjectId, ref: "Menu" },
    footerCopyrightText: { type: String },
    showNewsletter: { type: Boolean, default: true },
    paymentIcons: [{ type: String }],

    globalMetaTitle: { type: String },
    globalMetaDescription: { type: String },
    globalKeywords: { type: String },
    globalOgImage: { type: String },
    globalRobots: { type: String },
    globalJsonLd: { type: String },
  },
  { timestamps: true }
);

export const Setting = (mongoose.models.Setting as Model<ISetting>) || mongoose.model<ISetting>("Setting", SettingSchema);
export default Setting;
