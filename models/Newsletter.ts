import mongoose from "mongoose";

export interface INewsletter extends mongoose.Document {
  email: string;
  status: "subscribed" | "unsubscribed";
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new mongoose.Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
