import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  location: string;
  rating: number;
  text: string;
  type: "text" | "video";
  thumbnail?: string;
  videoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    type: { type: String, enum: ["text", "video"], default: "text" },
    thumbnail: { type: String },
    videoUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Testimonial as Model<ITestimonial>) || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
