import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const products = await Product.find({ _id: { $in: user.wishlist } });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, productId } = body;

    if (!email || !productId) {
      return NextResponse.json({ success: false, error: "Email and Product ID are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const products = await Product.find({ _id: { $in: user.wishlist } });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
