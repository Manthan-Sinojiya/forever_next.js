import mongoose from "mongoose";

export interface IContactMessage extends mongoose.Document {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new mongoose.Schema<IContactMessage>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
