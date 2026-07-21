"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Media from "@/models/Media";
import { logActivity } from "./activityLogs";
import fs from "fs/promises";
import path from "path";

export async function getMedia() {
  await dbConnect();
  const media = await Media.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(media));
}

export async function deleteMedia(id: string, publicId: string) {
  try {
    await dbConnect();
    await Media.findByIdAndDelete(id);

    // Delete file from local storage
    const filepath = path.join(process.cwd(), "public", publicId);
    try {
      await fs.unlink(filepath);
    } catch {
      console.warn("File not found or could not be deleted:", filepath);
    }

    await logActivity("system", "DELETE_MEDIA", "Media", id);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete media";
    return { success: false, error: message };
  }
}
