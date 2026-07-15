import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Please enter email and password" }, { status: 400 });
    }

    await dbConnect();

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    // Verify password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
      }
    } else {
      // User registered without password (OAuth)
      return NextResponse.json({ success: false, error: "Please log in using your OAuth provider or reset password" }, { status: 400 });
    }

    // Success response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      state: user.state,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ success: true, data: userResponse }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Login failed" }, { status: 500 });
  }
}
