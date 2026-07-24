import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Coupon deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete coupon" }, { status: 400 });
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
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    return NextResponse.json({ success: true, data: updatedCoupon }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update coupon" }, { status: 400 });
  }
}
