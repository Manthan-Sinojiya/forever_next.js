import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";

export async function GET() {
  try {
    await dbConnect();
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: slides }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch slides" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const slide = await HeroSlide.create(body);
    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create slide" }, { status: 400 });
  }
}
