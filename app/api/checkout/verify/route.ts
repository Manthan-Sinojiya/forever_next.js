import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, simulated } = body;

    // Handle simulation verification
    if (simulated || (razorpay_order_id && razorpay_order_id.startsWith("sim_order_"))) {
      return NextResponse.json({ success: true, verified: true });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing verification signatures." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      // In case keys are missing but client attempted verification
      return NextResponse.json(
        { success: false, error: "Server payment configuration missing." },
        { status: 500 }
      );
    }

    // Cryptographic signature verification
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    const isValid = generated_signature === razorpay_signature;

    if (isValid) {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Signature verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
