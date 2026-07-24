import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Menu } from "@/models/Menu";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await connectDB();
    const { name } = await params;
    const menuName = decodeURIComponent(name);
    
    // Find menu by name (case-insensitive)
    const menu = await Menu.findOne({ name: { $regex: new RegExp(`^${menuName}$`, "i") } }).lean();
    
    if (!menu) {
      return NextResponse.json({ success: false, error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: menu });
  } catch (error: any) {
    console.error("Error fetching menu:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
