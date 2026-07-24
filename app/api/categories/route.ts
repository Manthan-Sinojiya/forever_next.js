import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    // Fetch all active categories directly from Category model
    const categories = await Category.find({ status: "active" }).lean();
    
    // Map them to ensure they have the isActive flag that the frontend expects
    const formattedCategories = categories.map((c: any) => ({
      ...c,
      isActive: true,
      image: c.image || (c.slug === "healthcare-equipments" ? "/categories/healthcare.png" : `/categories/${c.slug}.png`)
    }));

    return NextResponse.json({ success: true, data: formattedCategories });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
