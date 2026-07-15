import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendEmail } from "@/lib/mailer";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Order deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 400 });
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
    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });

    if (updatedOrder && body.status) {
      try {
        await sendEmail({
          to: updatedOrder.userEmail,
          subject: `Order Status Updated: ${updatedOrder.orderNumber} is now ${body.status}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Order Status Updated</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Your order is on the move!</p>
              </div>
              <div style="padding: 30px; background: white;">
                <p>Hi ${updatedOrder.shippingAddress.fullName || "Valued Customer"},</p>
                <p>We wanted to let you know that your order <strong>${updatedOrder.orderNumber}</strong> has been updated to status: <strong style="color: #1D4ED8; text-transform: uppercase;">${body.status}</strong>.</p>
                
                <p style="margin-top: 20px;">If you chose online payment or Cash on Delivery, the delivery details remain as submitted. You can track this order in your profile dashboard.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile?tab=Orders" style="background: #1D4ED8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">View Order in Dashboard</a>
                </div>
              </div>
              <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Forever Healthcare. All rights reserved.</p>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error("Failed to send status update email:", err);
      }
    }

    return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 400 });
  }
}
