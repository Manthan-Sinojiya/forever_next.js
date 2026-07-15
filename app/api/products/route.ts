import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const fetchAll = url.searchParams.get("all") === "true";
    const todayDeal = url.searchParams.get("todayDeal");
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");

    let query: any = {};
    if (todayDeal !== null) {
      query.todayDeal = todayDeal === "true";
    }
    if (featured !== null) {
      query.featured = featured === "true";
    }
    if (category !== null) {
      query.category = category;
    }
    
    let products;
    if (fetchAll) {
      products = await Product.find(query).sort({ createdAt: -1 });
    } else {
      if (Object.keys(query).length === 0) {
        products = await Product.find({ featured: true }).limit(6);
      } else {
        products = await Product.find(query).sort({ createdAt: -1 });
      }
    }
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 400 });
  }
}
