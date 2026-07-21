import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const counts = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = counts.reduce((acc: any, curr: any) => {
      if (curr._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    return NextResponse.json({ success: true, counts: result }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to get category counts" }, { status: 450 });
  }
}
