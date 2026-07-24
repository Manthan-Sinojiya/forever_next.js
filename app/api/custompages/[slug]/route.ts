import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { CustomPage } from "@/models/CustomPage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const page = await CustomPage.findOne({ slug, status: "published" });

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    console.error("Error fetching page by slug:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
