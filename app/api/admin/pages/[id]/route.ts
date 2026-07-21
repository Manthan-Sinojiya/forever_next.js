import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    // Check if ID is valid object id or a slug
    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }
    
    const page = await Page.findOne(query);
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: page }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch page" }, { status: 400 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await dbConnect();
    
    if (body.title && !body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    
    const page = await Page.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: page }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update page" }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const page = await Page.findByIdAndDelete(id);
    
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete page" }, { status: 400 });
  }
}
