import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "banned";
  address?: string;
  city?: string;
  state?: string;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    wishlist: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
export default User;
