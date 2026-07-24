import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fetchAll = url.searchParams.get("all") === "true";
    const todayDeal = url.searchParams.get("todayDeal");
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");

    const options: any = { fetchAll };
    if (todayDeal !== null) options.todayDeal = todayDeal === "true";
    if (featured !== null) options.featured = featured === "true";
    if (category !== null) options.category = category;
    if (limitParam !== null) options.limit = parseInt(limitParam, 10);

    let products = await getProducts(options);
    
    // Map category object to its name string, if populated; also ensure thumbnail is included
    const serialized = products.map((p: any) => {
      const doc = p.toObject ? p.toObject() : (p._doc || p);
      const catObj = doc.category;
      const categoryName = catObj && typeof catObj === 'object' && catObj.name
        ? catObj.name
        : (typeof catObj === 'string' && !/^[0-9a-fA-F]{24}$/.test(catObj) ? catObj : "General");

      return {
        ...doc,
        _id: doc._id?.toString(),
        category: categoryName,
        thumbnail: doc.thumbnail || (doc.images && doc.images.length > 0 ? doc.images[0].url : null),
        imageUrl: doc.thumbnail || (doc.images && doc.images.length > 0 ? doc.images[0].url : `/logo/logo.png`),
      };
    });
    
    return NextResponse.json({ success: true, data: serialized, total: serialized.length }, { status: 200 });
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
