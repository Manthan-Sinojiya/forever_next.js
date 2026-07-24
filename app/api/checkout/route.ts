import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalAmount } = body;

    if (!totalAmount || isNaN(totalAmount)) {
      return NextResponse.json(
        { success: false, error: "Invalid total amount." },
        { status: 400 }
      );
    }

    await connectDB();
    const settings = await Setting.findOne();
    const dbRazorpay = settings?.razorpay;

    // Use DB keys if enabled, else use ENV
    const keyId = dbRazorpay?.enabled && dbRazorpay?.keyId ? dbRazorpay.keyId : process.env.RAZORPAY_KEY_ID;
    const keySecret = dbRazorpay?.enabled && dbRazorpay?.keySecret ? dbRazorpay.keySecret : process.env.RAZORPAY_KEY_SECRET;

    // Fallback to simulation if environment variables or settings are not set
    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: true,
        simulated: true,
        orderId: `sim_order_${Date.now()}`,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(totalAmount * 100), // amount in paisa (e.g. 100 INR = 10000 paise)
      currency: "INR",
      receipt: `receipt_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      simulated: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initiate payment gateway." },
      { status: 500 }
    );
  }
}
