import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Slide deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete slide" }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    return NextResponse.json({ success: true, data: updatedSlide }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update slide" }, { status: 400 });
  }
}
