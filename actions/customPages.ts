"use server";

import connectDB from "@/lib/mongodb";
import { CustomPage } from "@/models/CustomPage";

export async function getPageBySlug(slug: string) {
  try {
    await connectDB();
    const page = await CustomPage.findOne({ slug, status: "published" }).lean();
    if (!page) return null;
    return JSON.parse(JSON.stringify(page));
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}
