import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent, resetSiteContent } from "@/lib/db";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load content" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid content payload" },
        { status: 400 }
      );
    }
    const updated = updateSiteContent(body);
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

export async function DELETE() {
  try {
    const reset = resetSiteContent();
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
