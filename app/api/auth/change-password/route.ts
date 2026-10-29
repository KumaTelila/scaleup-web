import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, changeAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const result = await changeAdminPassword(user.id, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Password update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
