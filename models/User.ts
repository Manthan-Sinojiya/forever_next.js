import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // Optional for OAuth users
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    wishlist: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
