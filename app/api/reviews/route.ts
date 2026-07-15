import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({}).sort({ createdAt: -1 });

    const productIds = reviews.map((r) => r.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select("name");

    const productMap = products.reduce((acc: Record<string, string>, p: any) => {
      acc[p._id.toString()] = p.name;
      return acc;
    }, {});

    const data = reviews.map((r: any) => ({
      ...r.toObject(),
      productName: productMap[r.productId] || "Unknown Product",
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Admin fetch reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing review ID or status." }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    console.error("Admin update review error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing review ID." }, { status: 400 });
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Review deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Admin delete review error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 400 });
  }
}
