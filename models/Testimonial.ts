import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  rating: number;
  customerImage?: string;
  designation?: string;
  company?: string;
  review: string;
  status: "active" | "draft" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  
  // Video fields
  videoType?: "upload" | "youtube" | "vimeo";
  videoUrl?: string;
  videoThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    customerImage: { type: String },
    designation: { type: String },
    company: { type: String },
    
    status: { type: String, enum: ["active", "draft", "archived"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    
    videoType: { type: String, enum: ["upload", "youtube", "vimeo"] },
    videoUrl: { type: String },
    videoThumbnail: { type: String },
  },
  { timestamps: true }
);

export const Testimonial = (mongoose.models.Testimonial as Model<ITestimonial>) || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
