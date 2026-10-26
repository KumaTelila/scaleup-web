import { NextRequest, NextResponse } from "next/server";
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, need, message, phone, company } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please tell us a bit more about your project (at least 5 characters)." },
        { status: 400 }
      );
    }

    const inquiry = createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      need: need || "ERP (Odoo)",
      message: message.trim(),
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. Our team will contact you within 24 hours.",
      inquiry,
    });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Server error processing your inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const inquiries = getInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve inquiries." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status." },
        { status: 400 }
      );
    }

    const updated = updateInquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id parameter." },
        { status: 400 }
      );
    }

    const deleted = deleteInquiry(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}
