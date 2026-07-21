import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Faq from "@/models/Faq";

export async function GET(_request: Request) {
  try {
    await dbConnect();
    const faqs = await Faq.find({ isActive: true }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: faqs }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch FAQs" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const faq = await Faq.create(body);
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create FAQ" }, { status: 400 });
  }
}
