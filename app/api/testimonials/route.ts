import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET(_request: Request) {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ rating: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch testimonials" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create testimonial" }, { status: 400 });
  }
}
