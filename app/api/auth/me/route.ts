import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedAdmin(request);
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}

