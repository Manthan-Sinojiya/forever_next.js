import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get("active") === "true";
    
    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    const pages = await Page.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: pages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    
    const page = await Page.create(body);
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create page" }, { status: 400 });
  }
}
