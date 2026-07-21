"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/mailer";

export async function getContactMessages() {
  await dbConnect();
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(messages));
}

export async function getContactMessage(id: string) {
  await dbConnect();
  const message = await ContactMessage.findById(id);
  return JSON.parse(JSON.stringify(message));
}

export async function updateContactStatus(id: string, status: string) {
  try {
    await dbConnect();
    await ContactMessage.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function replyToContact(id: string, replyText: string) {
  try {
    await dbConnect();
    const msg = await ContactMessage.findById(id);
    if (!msg) throw new Error("Message not found");

    await sendEmail({
      to: msg.email,
      subject: `Re: ${msg.subject}`,
      html: `<div>${replyText}</div>`,
    });

    msg.status = "replied";
    msg.repliedAt = new Date();
    await msg.save();

    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await dbConnect();
    await ContactMessage.findByIdAndDelete(id);
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
