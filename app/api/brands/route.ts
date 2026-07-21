import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find({}).sort({ featured: -1, name: 1 }).lean();
    return NextResponse.json({ success: true, data: brands });
  } catch {
    return NextResponse.json({ success: false, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const brand = await Brand.create(body);
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
