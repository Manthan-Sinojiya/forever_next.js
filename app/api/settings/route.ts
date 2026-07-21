import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await Setting.findOne({ key });
      return NextResponse.json({ success: true, data: setting }, { status: 200 });
    }

    const settings = await Setting.find({});
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();

    // Support bulk object payload: { key1: val1, key2: val2 }
    if (typeof body === "object" && body !== null && !body.key && !Array.isArray(body)) {
      const results = [];
      for (const [key, value] of Object.entries(body)) {
        const setting = await Setting.findOneAndUpdate(
          { key },
          { value: String(value) },
          { upsert: true, new: true }
        );
        results.push(setting);
      }
      return NextResponse.json({ success: true, data: results }, { status: 200 });
    }

    // Support bulk array payload: [{ key, value }, ...]
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const { key, value } = item;
        if (key && value !== undefined) {
          const setting = await Setting.findOneAndUpdate(
            { key },
            { value: String(value) },
            { upsert: true, new: true }
          );
          results.push(setting);
        }
      }
      return NextResponse.json({ success: true, data: results }, { status: 200 });
    }

    // Support single setting payload: { key, value }
    const { key, value } = body;
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Missing key or value" }, { status: 400 });
    }
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value: String(value) },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, data: setting }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 400 });
  }
}
