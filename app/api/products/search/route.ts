import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name price category imageUrl")
      .limit(6); // Limit suggestions to a maximum of 6 products

    return NextResponse.json({ success: true, data: suggestions }, { status: 200 });
  } catch (error) {
    console.error("Autocomplete search error:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 400 });
  }
}
