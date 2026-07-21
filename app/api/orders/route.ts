import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/services/orderService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    
    // Convert null to undefined if email is absent
    const orders = await getOrders(email || undefined);
    
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch orders" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create order" }, { status: 400 });
  }
}
