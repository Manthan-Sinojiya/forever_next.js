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

    const rawSuggestions = await Product.find({
      status: "active",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    })
      .select("name price category thumbnail images")
      .populate("category", "name")
      .limit(6)
      .lean();

    const suggestions = rawSuggestions.map((prod: any) => ({
      _id: prod._id,
      name: prod.name,
      price: prod.price,
      category: prod.category?.name || "General",
      imageUrl: prod.thumbnail || (prod.images && prod.images.length > 0 ? prod.images[0].url : "/logo/logo.png")
    }));

    return NextResponse.json({ success: true, data: suggestions }, { status: 200 });
  } catch (error) {
    console.error("Autocomplete search error:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 400 });
  }
}
