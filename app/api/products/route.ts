import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fetchAll = url.searchParams.get("all") === "true";
    const todayDeal = url.searchParams.get("todayDeal");
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");

    const options: any = { fetchAll };
    if (todayDeal !== null) options.todayDeal = todayDeal === "true";
    if (featured !== null) options.featured = featured === "true";
    if (category !== null) options.category = category;

    let products = await getProducts(options);
    
    // Map category object to its name string, if populated
    products = products.map((p: any) => {
      const doc = p._doc || p;
      return {
        ...doc,
        category: doc.category && doc.category.name ? doc.category.name : doc.category
      };
    });
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch products" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create product" }, { status: 400 });
  }
}
