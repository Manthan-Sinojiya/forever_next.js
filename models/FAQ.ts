import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.FAQ as Model<IFAQ>) || mongoose.model<IFAQ>("FAQ", FAQSchema);
