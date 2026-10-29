import fs from "fs";
import path from "path";
import {
  ContactInquiry,
  ConsultationBooking,
  SiteContent,
  DEFAULT_SITE_CONTENT,
} from "./types";

export * from "./types";

export interface DatabaseSchema {
  inquiries: ContactInquiry[];
  consultations: ConsultationBooking[];
  newsletter: { email: string; createdAt: string }[];
  content?: SiteContent;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "scaleup_store.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const INITIAL_DATA: DatabaseSchema = {
  inquiries: [
    {
      id: "inq-1",
      name: "Alemayehu Tadesse",
      email: "alemayehu@abyssiniatrading.et",
      phone: "+251 91 123 4567",
      company: "Abyssinia Trading & Distribution",
      need: "ERP (Odoo)",
      message:
        "We are currently managing inventory across 4 warehouses in Addis Ababa with Excel and disconnected software. We want to implement Odoo 17 Enterprise for sales, inventory, local invoicing, and bank reconciliations.",
      status: "new",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "inq-2",
      name: "Bethlehem Assefa",
      email: "b.assefa@zemenlogistics.com",
      phone: "+251 92 345 6789",
      company: "Zemen Logistics Solutions",
      need: "Web application",
      message:
        "We need a custom shipment tracking and client portal integrated with our internal operational systems and SMS notifications.",
      status: "in_review",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
    {
      id: "inq-3",
      name: "Dr. Dawit Hailu",
      email: "dhailu@oromiahealth.gov.et",
      phone: "+251 93 456 7890",
      company: "Regional Health Bureau",
      need: "Networking and infrastructure",
      message:
        "Reviewing network architecture, secure server backup protocols, and cloud migration for regional monitoring data.",
      status: "contacted",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ],
  consultations: [
    {
      id: "cons-1",
      name: "Tewodros Kassahun",
      email: "tk@finetextextiles.et",
      phone: "+251 91 222 3344",
      company: "FineTex Manufacturing",
      date: "2026-11-02",
      time: "10:00 AM",
      service: "ERP (Odoo)",
      notes: "Manufacturing module and bill of materials setup.",
      status: "confirmed",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
  ],
  newsletter: [
    { email: "tech-lead@ethiopianfintech.com", createdAt: new Date().toISOString() },
  ],
  content: DEFAULT_SITE_CONTENT,
};

function readDb(): DatabaseSchema {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.content) {
      parsed.content = DEFAULT_SITE_CONTENT;
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database:", error);
    return INITIAL_DATA;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Inquiries methods
export function getInquiries(): ContactInquiry[] {
  const db = readDb();
  return db.inquiries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createInquiry(
  data: Omit<ContactInquiry, "id" | "status" | "createdAt">
): ContactInquiry {
  const db = readDb();
  const newInquiry: ContactInquiry = {
    ...data,
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInquiry);
  writeDb(db);
  return newInquiry;
}

export function updateInquiryStatus(
  id: string,
  status: ContactInquiry["status"]
): ContactInquiry | null {
  const db = readDb();
  const index = db.inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;

  db.inquiries[index].status = status;
  writeDb(db);
  return db.inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const db = readDb();
  const originalLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  if (db.inquiries.length !== originalLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// Consultations methods
export function getConsultations(): ConsultationBooking[] {
  const db = readDb();
  return db.consultations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createConsultation(
  data: Omit<ConsultationBooking, "id" | "status" | "createdAt">
): ConsultationBooking {
  const db = readDb();
  const newBooking: ConsultationBooking = {
    ...data,
    id: `cons-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.consultations.unshift(newBooking);
  writeDb(db);
  return newBooking;
}

export function updateConsultationStatus(
  id: string,
  status: ConsultationBooking["status"]
): ConsultationBooking | null {
  const db = readDb();
  const index = db.consultations.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.consultations[index].status = status;
  writeDb(db);
  return db.consultations[index];
}

// Site Content CMS methods
export function getSiteContent(): SiteContent {
  const db = readDb();
  return db.content || DEFAULT_SITE_CONTENT;
}

export function updateSiteContent(newContent: Partial<SiteContent>): SiteContent {
  const db = readDb();
  db.content = {
    ...(db.content || DEFAULT_SITE_CONTENT),
    ...newContent,
  };
  writeDb(db);
  return db.content;
}

export function resetSiteContent(): SiteContent {
  const db = readDb();
  db.content = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  writeDb(db);
  return db.content as SiteContent;
}

export function getStats() {
  const db = readDb();
  return {
    totalInquiries: db.inquiries.length,
    newInquiries: db.inquiries.filter((i) => i.status === "new").length,
    activeConsultations: db.consultations.length,
    byService: {
      odoo: db.inquiries.filter((i) => i.need.includes("Odoo") || i.need.includes("ERP")).length,
      consulting: db.inquiries.filter((i) => i.need.includes("consulting")).length,
      web: db.inquiries.filter((i) => i.need.includes("Web")).length,
      mobile: db.inquiries.filter((i) => i.need.includes("Mobile")).length,
      infrastructure: db.inquiries.filter(
        (i) => i.need.includes("infrastructure") || i.need.includes("Network")
      ).length,
    },
    uptime: "99.98%",
    averageResponseTime: "< 2 hours",
  };
}
