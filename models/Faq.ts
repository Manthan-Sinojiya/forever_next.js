import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
  category?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Faq = (mongoose.models.Faq as Model<IFaq>) || mongoose.model<IFaq>("Faq", FaqSchema);
export default Faq;
