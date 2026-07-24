import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const fetchAll = url.searchParams.get("all") === "true";

    const filter: any = fetchAll
      ? {}
      : {
          $or: [
            { status: "active" },
            { status: { $exists: false } },
            { status: null }
          ]
        };

    const categories = await Category.find(filter).lean();
    
    // Map them to ensure they have the isActive flag that the frontend expects
    const formattedCategories = categories.map((c: any) => ({
      ...c,
      isActive: c.status ? c.status === "active" : true,
      image: c.image || (c.slug === "healthcare-equipments" ? "/categories/healthcare.png" : `/categories/${c.slug}.png`)
    }));

    return NextResponse.json({ success: true, data: formattedCategories });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
