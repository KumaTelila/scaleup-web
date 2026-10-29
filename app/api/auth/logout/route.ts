import { NextResponse } from "next/server";
import { destroySession, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    let token: string | undefined;
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith(`${AUTH_COOKIE_NAME}=`)) {
          token = decodeURIComponent(cookie.substring(AUTH_COOKIE_NAME.length + 1));
          break;
        }
      }
    }

    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (token) {
      await destroySession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    const isHttps =
      request.url.startsWith("https://") ||
      request.headers.get("x-forwarded-proto") === "https" ||
      process.env.VERCEL === "1";

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    console.error("Logout route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
