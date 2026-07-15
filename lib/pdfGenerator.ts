import PDFDocument from "pdfkit";

export async function generateInvoicePdf(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Design header
      doc.fillColor("#059669").fontSize(20).text("FOREVER HEALTHCARE", { align: "right" });
      doc.fillColor("#64748b").fontSize(8).text("Wellness & Health Supplements", { align: "right" });
      doc.text("https://foreverhealthcare.in", { align: "right" });
      doc.moveDown(1);

      // Divider line
      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1.5);

      // Invoice Title
      doc.fillColor("#1e293b").fontSize(16).text("TAX INVOICE / RECEIPT", { underline: true });
      doc.moveDown(1);

      // Metadata details
      const startY = doc.y;
      doc.fontSize(9).fillColor("#475569");
      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Payment ID: ${order.paymentId || "Prepaid / COD"}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}`);
      doc.text(`Status: ${order.status}`);

      // Customer info on the right side
      doc.text("Billed To:", 300, startY);
      doc.text(order.shippingAddress.fullName, 300, startY + 12);
      doc.text(order.shippingAddress.addressLine, 300, startY + 24);
      doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`,
        300,
        startY + 36
      );
      doc.text(`Phone: ${order.shippingAddress.phone}`, 300, startY + 48);

      doc.moveDown(3);

      // Reset X
      doc.x = 50;

      // Table Headers
      const tableTop = doc.y + 20;
      doc.fillColor("#0f172a").fontSize(9);
      doc.text("Item Description", 50, tableTop);
      doc.text("Qty", 350, tableTop, { width: 30, align: "right" });
      doc.text("Unit Price", 400, tableTop, { width: 60, align: "right" });
      doc.text("Total", 480, tableTop, { width: 70, align: "right" });

      // Table Header border
      doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(50, tableTop + 14).lineTo(550, tableTop + 14).stroke();

      let rowY = tableTop + 22;
      order.items.forEach((item: any) => {
        doc.fillColor("#334155");
        doc.text(item.name, 50, rowY, { width: 280 });
        doc.text(String(item.quantity), 350, rowY, { width: 30, align: "right" });
        doc.text(`₹${item.price.toFixed(2)}`, 400, rowY, { width: 60, align: "right" });
        doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 480, rowY, { width: 70, align: "right" });
        rowY += 24;
      });

      // Subtotals, Discount, Tax, and Grand Total block
      rowY += 10;
      doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(50, rowY).lineTo(550, rowY).stroke();
      rowY += 12;

      const subtotal = order.subtotal || order.items.reduce((acc: number, it: any) => acc + it.price * it.quantity, 0);
      const tax = order.taxAmount || subtotal * 0.18;
      const discount = order.discountAmount || 0;
      const total = order.totalAmount || subtotal + tax - discount;

      doc.fillColor("#475569").fontSize(9);
      doc.text("Subtotal:", 350, rowY, { width: 110, align: "right" });
      doc.fillColor("#0f172a").text(`₹${subtotal.toFixed(2)}`, 480, rowY, { width: 70, align: "right" });
      rowY += 16;

      if (discount > 0) {
        doc.fillColor("#10b981");
        doc.text(`Discount (${order.couponCode || "Promo"}):`, 350, rowY, { width: 110, align: "right" });
        doc.text(`-₹${discount.toFixed(2)}`, 480, rowY, { width: 70, align: "right" });
        rowY += 16;
      }

      doc.fillColor("#475569");
      doc.text("GST (18%):", 350, rowY, { width: 110, align: "right" });
      doc.fillColor("#0f172a").text(`₹${tax.toFixed(2)}`, 480, rowY, { width: 70, align: "right" });
      rowY += 16;

      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(350, rowY).lineTo(550, rowY).stroke();
      rowY += 8;

      doc.fillColor("#059669").fontSize(11);
      doc.text("Grand Total:", 350, rowY, { width: 110, align: "right" });
      doc.text(`₹${total.toFixed(2)}`, 480, rowY, { width: 70, align: "right" });

      // Footer note
      doc.fillColor("#64748b").fontSize(8).text("Thank you for shopping with Forever Healthcare!", 50, 700, { align: "center" });
      doc.text("For any queries, please write to contact@foreverhealthcare.in", 50, 712, { align: "center" });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
