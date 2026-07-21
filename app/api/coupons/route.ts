import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    
    if (code) {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return NextResponse.json({ success: false, message: "Coupon code not found." }, { status: 404 });
      }
      if (!coupon.isActive) {
        return NextResponse.json({ success: false, message: "Coupon is no longer active." }, { status: 400 });
      }

      // Check expiration date
      if (coupon.expiryDate) {
        const expiry = new Date(coupon.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expiry < today) {
          return NextResponse.json({ success: false, message: "This coupon code has expired." }, { status: 400 });
        }
      }

      // Check minimum purchase limit
      const subtotalParam = url.searchParams.get("subtotal");
      if (subtotalParam) {
        const subtotal = parseFloat(subtotalParam);
        if (subtotal < coupon.minPurchase) {
          return NextResponse.json(
            { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} is required for this coupon.` },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({ success: true, data: coupon }, { status: 200 });
    }
    
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: coupons }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 400 });
  }
}
