import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent, resetSiteContent } from "@/lib/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public: Landing page reads site content
export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load content" },
      { status: 500 }
    );
  }
}

// Protected: Only authenticated admins can update live website content
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedAdmin(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid content payload" },
        { status: 400 }
      );
    }
    const updated = await updateSiteContent(body);
    return NextResponse.json({
      success: true,
      message: "Website content updated successfully!",
      content: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// Protected: Only authenticated admins can reset content
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedAdmin(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    const reset = await resetSiteContent();
    return NextResponse.json({
      success: true,
      message: "Website content reset to factory defaults.",
      content: reset,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to reset content" },
      { status: 500 }
    );
  }
}
