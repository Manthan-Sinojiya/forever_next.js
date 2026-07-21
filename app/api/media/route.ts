import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/models/Media";
import { logActivity } from "@/actions/admin/activityLogs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "system";
    
    const body = await request.json();
    await dbConnect();
    
    const media = await Media.create(body);
    await logActivity(userId, "CREATE_MEDIA", "Media", media._id.toString(), `Uploaded ${media.url}`);
    
    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
