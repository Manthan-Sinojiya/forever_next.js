import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const reviews = await Review.find({ productId: id, status: "Approved" }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { userName, userEmail, rating, comment } = body;

    if (!userName || !userEmail || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const review = await Review.create({
      productId: id,
      userName,
      userEmail,
      rating,
      comment,
      status: "Pending", // requires admin approval
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Submit review error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 400 });
  }
}
