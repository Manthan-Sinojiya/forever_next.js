import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FAQ from "@/models/FAQ";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const faqs = await FAQ.find({ isActive: true }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: faqs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch FAQs" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create FAQ" }, { status: 400 });
  }
}
