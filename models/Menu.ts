import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMenuLink {
  label: string;
  url: string;
  icon?: string;
  order: number;
  isOpenInNewTab: boolean;
  isActive: boolean;
  children?: IMenuLink[];
}

export interface IMenu extends Document {
  name: string; // e.g., 'Main Header', 'Footer Column 1'
  links: IMenuLink[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuLinkSchema = new Schema<IMenuLink>();
MenuLinkSchema.add({
  label: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  order: { type: Number, default: 0 },
  isOpenInNewTab: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  children: [MenuLinkSchema]
});

const MenuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true, unique: true },
    links: [MenuLinkSchema],
  },
  { timestamps: true }
);

export const Menu = (mongoose.models.Menu as Model<IMenu>) || mongoose.model<IMenu>("Menu", MenuSchema);
export default Menu;
