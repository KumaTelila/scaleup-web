import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { AdminUser, AdminUserRecord, AdminSession } from "./types";

export const AUTH_COOKIE_NAME = "scaleup_admin_session";

// Database connections
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "scaleup_store.json");

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

// Security hashing helpers
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computedHash, "hex"));
  } catch (err) {
    return false;
  }
}

export function generateSessionToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
}

export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// Local fallback store helpers
interface LocalStoreWithAuth {
  inquiries?: any[];
  consultations?: any[];
  newsletter?: any[];
  content?: any;
  adminUsers?: AdminUserRecord[];
  adminSessions?: AdminSession[];
}

function readLocalDb(): LocalStoreWithAuth {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { adminUsers: [], adminSessions: [] };
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.adminUsers) parsed.adminUsers = [];
    if (!parsed.adminSessions) parsed.adminSessions = [];
    return parsed;
  } catch (error) {
    return { adminUsers: [], adminSessions: [] };
  }
}

function writeLocalDb(data: LocalStoreWithAuth): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) : {};
    fs.writeFileSync(DB_FILE, JSON.stringify({ ...current, ...data }, null, 2), "utf-8");
  } catch (error) {
    console.error("Local database write error in auth:", error);
  }
}

// Ensure default administrator exists
export async function ensureDefaultAdmin(): Promise<void> {
  const defaultEmail = process.env.ADMIN_EMAIL || "admin@scaleuptech.et";
  const defaultUsername = process.env.ADMIN_USERNAME || "admin";
  const defaultPassword = process.env.ADMIN_PASSWORD || "ScaleUp@Admin2026!";
  const defaultName = "ScaleUp Administrator";

  const sql = getSql();
  if (sql) {
    try {
      // Create tables if not present
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

      // Check if any admin exists
      const existing = await sql`SELECT id FROM admin_users LIMIT 1;`;
      if (existing.length === 0) {
        const { hash, salt } = hashPassword(defaultPassword);
        const adminId = `usr_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
        await sql`
          INSERT INTO admin_users (id, email, username, password_hash, salt, name, role)
          VALUES (${adminId}, ${defaultEmail}, ${defaultUsername}, ${hash}, ${salt}, ${defaultName}, 'superadmin')
          ON CONFLICT (email) DO NOTHING;
        `;
      }
      return;
    } catch (err) {
      console.error("Error ensuring default admin in Neon:", err);
    }
  }

  // Local file fallback
  const localDb = readLocalDb();
  if (!localDb.adminUsers || localDb.adminUsers.length === 0) {
    const { hash, salt } = hashPassword(defaultPassword);
    const newAdmin: AdminUserRecord = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      email: defaultEmail,
      username: defaultUsername,
      name: defaultName,
      role: "superadmin",
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString(),
    };
    localDb.adminUsers = [newAdmin];
    writeLocalDb(localDb);
  }
}

// Authenticate user with password
export async function authenticateAdmin(
  identifier: string,
  pass: string,
  meta?: { ip?: string; userAgent?: string }
): Promise<{
  success: boolean;
  user?: AdminUser;
  rawToken?: string;
  error?: string;
}> {
  await ensureDefaultAdmin();

  const trimmedId = identifier.trim().toLowerCase();
  const sql = getSql();

  if (sql) {
    try {
      const rows = await sql`
        SELECT id, email, username, password_hash, salt, name, role, created_at, last_login
        FROM admin_users
        WHERE LOWER(username) = ${trimmedId} OR LOWER(email) = ${trimmedId}
        LIMIT 1;
      `;

      if (rows.length === 0) {
        return { success: false, error: "Invalid username or password" };
      }

      const record = rows[0];
      const valid = verifyPassword(pass, record.password_hash, record.salt);
      if (!valid) {
        return { success: false, error: "Invalid username or password" };
      }

      // Generate session token
      const { rawToken, tokenHash } = generateSessionToken();
      const sessionId = `ses_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await sql`
        INSERT INTO admin_sessions (id, user_id, token_hash, expires_at, ip_address, user_agent)
        VALUES (${sessionId}, ${record.id}, ${tokenHash}, ${expiresAt.toISOString()}, ${meta?.ip || null}, ${meta?.userAgent || null});
      `;

      // Update last login
      await sql`
        UPDATE admin_users SET last_login = NOW() WHERE id = ${record.id};
      `;

      const user: AdminUser = {
        id: record.id,
        email: record.email,
        username: record.username,
        name: record.name,
        role: record.role,
        createdAt: record.created_at,
        lastLogin: new Date().toISOString(),
      };

      return { success: true, user, rawToken };
    } catch (err: any) {
      console.error("Neon auth error:", err);
      return { success: false, error: "Authentication system failure" };
    }
  }

  // Local file fallback
  const localDb = readLocalDb();
  const record = localDb.adminUsers?.find(
    (u) => u.username.toLowerCase() === trimmedId || u.email.toLowerCase() === trimmedId
  );

  if (!record) {
    return { success: false, error: "Invalid username or password" };
  }

  const valid = verifyPassword(pass, record.passwordHash, record.salt);
  if (!valid) {
    return { success: false, error: "Invalid username or password" };
  }

  const { rawToken, tokenHash } = generateSessionToken();
  const sessionId = `ses_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  if (!localDb.adminSessions) localDb.adminSessions = [];
  localDb.adminSessions.push({
    id: sessionId,
    userId: record.id,
    tokenHash,
    createdAt: new Date().toISOString(),
    expiresAt,
    ipAddress: meta?.ip,
    userAgent: meta?.userAgent,
  });

  record.lastLogin = new Date().toISOString();
  writeLocalDb(localDb);

  const user: AdminUser = {
    id: record.id,
    email: record.email,
    username: record.username,
    name: record.name,
    role: record.role,
    createdAt: record.createdAt,
    lastLogin: record.lastLogin,
  };

  return { success: true, user, rawToken };
}

// Validate active session
export async function validateSession(rawToken: string | null | undefined): Promise<{
  valid: boolean;
  user?: AdminUser;
}> {
  if (!rawToken || typeof rawToken !== "string" || rawToken.trim() === "") {
    return { valid: false };
  }

  const tokenHash = hashToken(rawToken.trim());
  const sql = getSql();

  if (sql) {
    try {
      const rows = await sql`
        SELECT s.id as session_id, s.expires_at, u.id, u.email, u.username, u.name, u.role, u.created_at, u.last_login
        FROM admin_sessions s
        JOIN admin_users u ON s.user_id = u.id
        WHERE s.token_hash = ${tokenHash}
          AND s.expires_at > NOW()
        LIMIT 1;
      `;

      if (rows.length === 0) {
        return { valid: false };
      }

      const row = rows[0];
      return {
        valid: true,
        user: {
          id: row.id,
          email: row.email,
          username: row.username,
          name: row.name,
          role: row.role,
          createdAt: row.created_at,
          lastLogin: row.last_login,
        },
      };
    } catch (err) {
      console.error("Neon session validation error:", err);
      return { valid: false };
    }
  }

  // Local file fallback
  const localDb = readLocalDb();
  const session = localDb.adminSessions?.find((s) => s.tokenHash === tokenHash);
  if (!session) return { valid: false };

  const now = new Date();
  if (new Date(session.expiresAt) <= now) {
    // Expired
    localDb.adminSessions = (localDb.adminSessions || []).filter((s) => s.tokenHash !== tokenHash);
    writeLocalDb(localDb);
    return { valid: false };
  }

  const userRecord = localDb.adminUsers?.find((u) => u.id === session.userId);
  if (!userRecord) return { valid: false };

  return {
    valid: true,
    user: {
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      name: userRecord.name,
      role: userRecord.role,
      createdAt: userRecord.createdAt,
      lastLogin: userRecord.lastLogin,
    },
  };
}

// Destroy session on logout
export async function destroySession(rawToken: string | null | undefined): Promise<boolean> {
  if (!rawToken) return true;
  const tokenHash = hashToken(rawToken.trim());
  const sql = getSql();

  if (sql) {
    try {
      await sql`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash};`;
      return true;
    } catch (err) {
      console.error("Neon destroy session error:", err);
      return false;
    }
  }

  const localDb = readLocalDb();
  localDb.adminSessions = (localDb.adminSessions || []).filter((s) => s.tokenHash !== tokenHash);
  writeLocalDb(localDb);
  return true;
}

// Change Admin Password
export async function changeAdminPassword(
  userId: string,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPass || newPass.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long" };
  }

  const sql = getSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT password_hash, salt FROM admin_users WHERE id = ${userId} LIMIT 1;
      `;
      if (rows.length === 0) {
        return { success: false, error: "User account not found" };
      }

      const valid = verifyPassword(currentPass, rows[0].password_hash, rows[0].salt);
      if (!valid) {
        return { success: false, error: "Current password does not match" };
      }

      const { hash: newHash, salt: newSalt } = hashPassword(newPass);
      await sql`
        UPDATE admin_users
        SET password_hash = ${newHash}, salt = ${newSalt}
        WHERE id = ${userId};
      `;

      return { success: true };
    } catch (err: any) {
      console.error("Neon change password error:", err);
      return { success: false, error: "Failed to update password in database" };
    }
  }

  // Local fallback
  const localDb = readLocalDb();
  const user = localDb.adminUsers?.find((u) => u.id === userId);
  if (!user) return { success: false, error: "User account not found" };

  const valid = verifyPassword(currentPass, user.passwordHash, user.salt);
  if (!valid) return { success: false, error: "Current password does not match" };

  const { hash: newHash, salt: newSalt } = hashPassword(newPass);
  user.passwordHash = newHash;
  user.salt = newSalt;
  writeLocalDb(localDb);
  return { success: true };
}

// Helper to extract session from Request (Cookie or Authorization header)
export async function getAuthenticatedAdmin(
  request: Request
): Promise<AdminUser | null> {
  let token: string | undefined;

  // 1. Check Cookie header
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

  // 2. Check Authorization Bearer header
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  const result = await validateSession(token);
  return result.valid && result.user ? result.user : null;
}

