import connectDB from "@/lib/mongodb";
import { Testimonial as TestimonialModel } from "@/models/Testimonial";
import TestimonialsListingClient from "./TestimonialsListingClient";

export default async function TestimonialsPage() {
  await connectDB();
  const rawTestimonials = await TestimonialModel.find({ status: "active" })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const testimonials = JSON.parse(JSON.stringify(rawTestimonials));

  return <TestimonialsListingClient initialTestimonials={testimonials} />;
}
