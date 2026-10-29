import { neon } from "@neondatabase/serverless";
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

// Neon Connection
function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

// Auto-initialize Neon PostgreSQL tables if connecting for the first time
let tablesInitialized = false;
async function ensureTables(sql: any) {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        need VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS consultations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50),
        service VARCHAR(100),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login TIMESTAMPTZ
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL,
        ip_address VARCHAR(100),
        user_agent TEXT
      );
    `;
    tablesInitialized = true;
  } catch (err) {
    console.error("Neon table check error:", err);
  }
}

// Fallback: local file store
function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalDb(): DatabaseSchema {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(DB_FILE)) {
      return {
        inquiries: [],
        consultations: [],
        newsletter: [],
        content: DEFAULT_SITE_CONTENT,
      };
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.content) parsed.content = DEFAULT_SITE_CONTENT;
    return parsed;
  } catch (error) {
    return {
      inquiries: [],
      consultations: [],
      newsletter: [],
      content: DEFAULT_SITE_CONTENT,
    };
  }
}

function writeLocalDb(data: DatabaseSchema): void {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Local DB write error:", error);
  }
}

// ================= INQUIRIES =================
export async function getInquiries(): Promise<ContactInquiry[]> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        SELECT * FROM inquiries ORDER BY created_at DESC
      `;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        need: r.need,
        message: r.message,
        phone: r.phone || undefined,
        company: r.company || undefined,
        status: r.status as ContactInquiry["status"],
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.error("Neon getInquiries error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  return db.inquiries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createInquiry(
  data: Omit<ContactInquiry, "id" | "status" | "createdAt">
): Promise<ContactInquiry> {
  const id = `inq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const createdAt = new Date().toISOString();

  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`
        INSERT INTO inquiries (id, name, email, need, message, phone, company, status, created_at)
        VALUES (
          ${id},
          ${data.name},
          ${data.email},
          ${data.need},
          ${data.message},
          ${data.phone || null},
          ${data.company || null},
          'new',
          ${createdAt}
        )
      `;
      return {
        id,
        ...data,
        status: "new",
        createdAt,
      };
    } catch (err) {
      console.error("Neon createInquiry error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  const newInquiry: ContactInquiry = {
    ...data,
    id,
    status: "new",
    createdAt,
  };
  db.inquiries.unshift(newInquiry);
  writeLocalDb(db);
  return newInquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: ContactInquiry["status"]
): Promise<ContactInquiry | null> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        UPDATE inquiries SET status = ${status} WHERE id = ${id} RETURNING *
      `;
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        need: r.need,
        message: r.message,
        phone: r.phone || undefined,
        company: r.company || undefined,
        status: r.status as ContactInquiry["status"],
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    } catch (err) {
      console.error("Neon updateInquiryStatus error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  const index = db.inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;
  db.inquiries[index].status = status;
  writeLocalDb(db);
  return db.inquiries[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`DELETE FROM inquiries WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.error("Neon deleteInquiry error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  const originalLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  if (db.inquiries.length !== originalLength) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

// ================= CONSULTATIONS =================
export async function getConsultations(): Promise<ConsultationBooking[]> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        SELECT * FROM consultations ORDER BY created_at DESC
      `;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone || undefined,
        company: r.company || undefined,
        date: r.date,
        time: r.time || undefined,
        service: r.service,
        notes: r.notes || undefined,
        status: r.status as ConsultationBooking["status"],
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.error("Neon getConsultations error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  return db.consultations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createConsultation(
  data: Omit<ConsultationBooking, "id" | "status" | "createdAt">
): Promise<ConsultationBooking> {
  const id = `cons-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const createdAt = new Date().toISOString();

  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`
        INSERT INTO consultations (id, name, email, phone, company, date, time, service, notes, status, created_at)
        VALUES (
          ${id},
          ${data.name},
          ${data.email},
          ${data.phone || null},
          ${data.company || null},
          ${data.date},
          ${data.time || null},
          ${data.service},
          ${data.notes || null},
          'pending',
          ${createdAt}
        )
      `;
      return {
        id,
        ...data,
        status: "pending",
        createdAt,
      };
    } catch (err) {
      console.error("Neon createConsultation error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  const newBooking: ConsultationBooking = {
    ...data,
    id,
    status: "pending",
    createdAt,
  };
  db.consultations.unshift(newBooking);
  writeLocalDb(db);
  return newBooking;
}

// ================= SITE CONTENT (CMS) =================
export async function getSiteContent(): Promise<SiteContent> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        SELECT data FROM site_content WHERE id = 'current'
      `;
      if (rows.length > 0 && rows[0].data) {
        return rows[0].data as SiteContent;
      }
      // Seed default in Neon
      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(DEFAULT_SITE_CONTENT)}, NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      return DEFAULT_SITE_CONTENT;
    } catch (err) {
      console.error("Neon getSiteContent error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  return db.content || DEFAULT_SITE_CONTENT;
}

export async function updateSiteContent(newContent: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getSiteContent();
  const updated: SiteContent = {
    ...current,
    ...newContent,
  };

  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(updated)}, NOW())
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(updated)}, updated_at = NOW()
      `;
      return updated;
    } catch (err) {
      console.error("Neon updateSiteContent error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  db.content = updated;
  writeLocalDb(db);
  return updated;
}

export async function resetSiteContent(): Promise<SiteContent> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(DEFAULT_SITE_CONTENT)}, NOW())
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(DEFAULT_SITE_CONTENT)}, updated_at = NOW()
      `;
      return DEFAULT_SITE_CONTENT;
    } catch (err) {
      console.error("Neon resetSiteContent error, falling back to local:", err);
    }
  }

  const db = readLocalDb();
  db.content = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  writeLocalDb(db);
  return db.content as SiteContent;
}

// ================= STATS =================
export async function getStats() {
  const [inquiries, consultations] = await Promise.all([
    getInquiries(),
    getConsultations(),
  ]);

  const isPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  return {
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((i) => i.status === "new").length,
    activeConsultations: consultations.length,
    byService: {
      odoo: inquiries.filter((i) => i.need.includes("Odoo") || i.need.includes("ERP")).length,
      consulting: inquiries.filter((i) => i.need.includes("consulting")).length,
      web: inquiries.filter((i) => i.need.includes("Web")).length,
      mobile: inquiries.filter((i) => i.need.includes("Mobile")).length,
      infrastructure: inquiries.filter(
        (i) => i.need.includes("infrastructure") || i.need.includes("Network")
      ).length,
    },
    uptime: "99.98%",
    averageResponseTime: "< 2 hours",
    database: isPostgres ? "Neon PostgreSQL (Serverless)" : "Local Persistent JSON",
  };
}
