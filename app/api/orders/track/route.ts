import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const email = searchParams.get("email");

    await dbConnect();

    if (orderId) {
      // Find by orderId field or _id
      const orConditions: any[] = [
        { orderNumber: orderId },
        { orderId: orderId }
      ];
      if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
        orConditions.push({ _id: orderId });
      }

      const order = await Order.findOne({ $or: orConditions }).lean();

      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: order });
    }

    if (email) {
      const orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: orders });
    }

    return NextResponse.json({ success: false, error: "orderId or email required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
