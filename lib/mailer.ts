import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
}

export async function sendEmail({ to, subject, html, attachments }: EmailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: parseInt(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Forever Healthcare" <${SMTP_USER}>`,
        to,
        subject,
        html,
        attachments,
      });

      console.log("Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error("Nodemailer transport error:", error);
      // Proceed to mock log on SMTP delivery failure
    }
  }

  // Fallback / Development Mock Mode
  console.log(`[SMTP SIMULATION] To: ${to} | Subject: ${subject} | Attachments: ${attachments?.length || 0}`);
  try {
    const logDir = path.join(process.cwd(), "public", "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, "emails-log.json");
    let logs: any[] = [];
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, "utf-8");
      try {
        logs = JSON.parse(content || "[]");
      } catch {
        logs = [];
      }
    }
    logs.push({
      to,
      subject,
      html,
      hasAttachment: !!attachments?.length,
      timestamp: new Date().toISOString(),
    });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Error writing simulated mail log:", err);
  }

  return { success: true, simulated: true };
}
