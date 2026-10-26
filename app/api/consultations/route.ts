import { NextRequest, NextResponse } from "next/server";
import { createConsultation, getConsultations } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, date, time, service, notes } = body;

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

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Please select a preferred date for the consultation." },
        { status: 400 }
      );
    }

    const booking = createConsultation({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
      date,
      time: time || "10:00 AM",
      service: service || "ERP (Odoo)",
      notes: notes ? notes.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Your consultation has been requested for ${date} at ${time || "10:00 AM"}. We will send a confirmation link to ${email}.`,
      booking,
    });
  } catch (error) {
    console.error("Error in /api/consultations:", error);
    return NextResponse.json(
      { success: false, error: "Server error booking consultation." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const bookings = getConsultations();
    return NextResponse.json({ success: true, consultations: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve consultations." },
      { status: 500 }
    );
  }
}
