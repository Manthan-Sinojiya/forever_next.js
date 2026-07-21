import mongoose from "mongoose";

export interface IHeroSlide extends mongoose.Document {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  showOverlay?: boolean;
}

const HeroSlideSchema = new mongoose.Schema<IHeroSlide>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    imageUrl: { type: String, required: true },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/products" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    showOverlay: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
