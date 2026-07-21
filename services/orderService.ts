import dbConnect from "@/lib/mongodb";
import Order, { IOrder } from "@/models/Order";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/mailer";
import { generateInvoicePdf } from "@/lib/pdfGenerator";

export async function getOrders(email?: string) {
  await dbConnect();
  
  if (email) {
    return await Order.find({ userEmail: email }).sort({ createdAt: -1 });
  }
  return await Order.find({}).sort({ createdAt: -1 });
}

export async function createOrder(data: Partial<IOrder>) {
  await dbConnect();
  
  // Generate order number
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const orderData = { ...data, orderNumber };
  
  const order = await Order.create(orderData);
  
  // Asynchronously trigger the email sending without awaiting it 
  // to prevent blocking the checkout response
  sendOrderConfirmationEmail(order).catch(err => {
    console.error("Order confirmation email failed:", err);
  });

  return order;
}

export async function updateOrder(id: string, data: Partial<IOrder>) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid order ID");
  }
  
  const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
  
  if (updatedOrder && data.orderStatus) {
    // Asynchronously send status update email
    sendOrderStatusUpdateEmail(updatedOrder, data.orderStatus).catch(err => {
      console.error("Failed to send status update email:", err);
    });
  }
  
  return updatedOrder;
}

export async function deleteOrder(id: string) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid order ID");
  }
  
  return await Order.findByIdAndDelete(id);
}

// --- Private Helpers ---

async function sendOrderConfirmationEmail(order: any) {
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
}

async function sendOrderStatusUpdateEmail(updatedOrder: any, status: string) {
  await sendEmail({
    to: updatedOrder.userEmail,
    subject: `Order Status Updated: ${updatedOrder.orderNumber} is now ${status}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Order Status Updated</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your order is on the move!</p>
        </div>
        <div style="padding: 30px; background: white;">
          <p>Hi ${updatedOrder.shippingAddress.fullName || "Valued Customer"},</p>
          <p>We wanted to let you know that your order <strong>${updatedOrder.orderNumber}</strong> has been updated to status: <strong style="color: #1D4ED8; text-transform: uppercase;">${status}</strong>.</p>
          
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
}
