import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET all users (Admin only check can be integrated here)
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}

// POST register a new user
export async function POST(request: Request) {
  try {
    const { name, email, password, phone, city, state, role } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Please provide name, email, and password" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ success: false, error: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      state,
      role: role || "user", // support setting admin role for local seed/setup
    });

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city,
      state: newUser.state,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create user" }, { status: 500 });
  }
}
