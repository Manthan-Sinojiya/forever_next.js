import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendEmail } from "@/lib/mailer";
import { generateInvoicePdf } from "@/lib/pdfGenerator";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    
    let orders;
    if (email) {
      orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Generate order number
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderData = { ...body, orderNumber };
    
    const order = await Order.create(orderData);

    // Send confirmation email
    try {
      const itemsList = order.items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="${item.imageUrl || 'https://foreverhealthcare.in/logo/logo.png'}" alt="${item.name}" width="50" style="border-radius: 8px; vertical-align: middle; margin-right: 10px;"/>
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
        </tr>
      `).join('');

      let pdfBuffer: Buffer | undefined;
      try {
        pdfBuffer = await generateInvoicePdf(order);
      } catch (pdfErr) {
        console.error("PDF Invoice generation failed:", pdfErr);
      }

      await sendEmail({
        to: order.userEmail,
        subject: `Order Confirmed: ${order.orderNumber} - Forever Healthcare`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #10B981, #047857); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Order Confirmed!</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for shopping with Forever Healthcare</p>
            </div>
            <div style="padding: 30px; background: white;">
              <p>Hi ${order.shippingAddress.fullName || "Valued Customer"},</p>
              <p>Your order <strong>${order.orderNumber}</strong> has been successfully placed. Here are the order details:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left;">Product</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center;">Qty</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <div style="text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #eee;">
                <h3 style="margin: 0; color: #047857; font-size: 20px;">Total: ₹${order.totalAmount.toFixed(2)}</h3>
                <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">Payment Method: ${order.paymentMethod || "COD"}</p>
              </div>

              <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h4 style="margin: 0 0 10px 0; color: #1e293b;">Delivery Address</h4>
                <p style="margin: 0; font-size: 14px; color: #475569;">
                  <strong>${order.shippingAddress.fullName}</strong><br/>
                  ${order.shippingAddress.addressLine},<br/>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}<br/>
                  Phone: ${order.shippingAddress.phone}
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile?tab=Orders" style="background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Track Your Order</a>
              </div>
            </div>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Forever Healthcare. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">If you have any questions, please contact our 24/7 support.</p>
            </div>
          </div>
        `,
        attachments: pdfBuffer ? [{
          filename: `invoice_${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }] : undefined
      });
    } catch (emailErr) {
      console.error("Order confirmation email failed:", emailErr);
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 400 });
  }
}
