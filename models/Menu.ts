import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMenuLink {
  label: string;
  url: string;
  order: number;
  isOpenInNewTab: boolean;
}

export interface IMenu extends Document {
  name: string; // e.g., 'Main Header', 'Footer Column 1'
  links: IMenuLink[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true, unique: true },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        isOpenInNewTab: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const Menu = (mongoose.models.Menu as Model<IMenu>) || mongoose.model<IMenu>("Menu", MenuSchema);
export default Menu;
