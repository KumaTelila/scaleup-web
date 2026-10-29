# ScaleUp Tech PLC — Enterprise Website, CMS & Operations Backend

Modern, high-performance enterprise website, dynamic CMS, and operations platform for **ScaleUp Tech PLC** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components, backed by **Neon Serverless PostgreSQL** and prepared for seamless deployment on **Vercel**.

This project faithfully preserves the original design, exact copy, brand identity, and color palette from `ScaleUp Tech PLC Website.html` while introducing a fully functional operations suite for lead capture, consultation scheduling, content management, and live database persistence.

---

## 🚀 Key Features

### 1. Pixel-Perfect HTML & Brand Preservation
- **Header & Navigation**: Sticky clean header with logo mark, branded typography (`ScaleUp` in `#0B1B4D`, `Tech PLC` in `#0B5FD9`), smooth scroll anchors, and responsive mobile menu. **Customer-facing navigation is 100% clean with no internal admin links.**
- **Hero Section**: Tagline (`ODOO ERP · SOFTWARE · INFRASTRUCTURE`), headline, value proposition, CTAs, and SVG business growth illustration with floating badges. Fully dynamic via Admin CMS.
- **Services ("What We Do")**:
  - **Featured Card (Odoo ERP)**: Dark navy hero card with 5 delivery checkmarks and direct inquiry button.
  - **Secondary Cards**: IT Consulting, Web Applications, Mobile Applications, and Networking & Infrastructure.
- **Why ScaleUp**: 3 core value pillars (01 Built for your context, 02 Delivery you can follow, 03 A partner after go-live).
- **Process ("How We Work")**: 5-stage delivery model (Discover, Design, Build, Launch, Run).
- **Clients ("Who We Serve")**: Growing SMEs, Public-sector bodies, and Mid-size enterprises.
- **Contact & Inquiries**: Branded gradient section with company contact details and interactive form.
- **Footer**: Company overview, links, discrete staff portal icon, and copyright notice.

### 2. shadcn/ui Components Integration
- **`Button`**: Branded variants (`default`, `navy`, `outline`, `secondary`, `ghost`, `link`, `accent`).
- **`Card`**: Custom rounded cards with `#DCE7F7` borders and subtle elevation.
- **`Input` & `Textarea`**: Custom styled inputs with `#9FB3D1` borders and `#1E88FF` focus rings.
- **`Select`**: Radix-powered dropdown with animated checkmarks and clean popover transitions.
- **`Badge`**: Pill-shaped status indicators and service badges.
- **`Dialog`**: Interactive discovery session scheduler modal.
- **`Accordion`**: Collapsible FAQ & process expansion.
- **`Toaster` (Sonner)**: Real-time feedback on inquiry submissions and status updates.

### 3. Enterprise Secure Admin Portal & CMS (`/admin`)
- **Multi-Layered Security Architecture**:
  - **Node.js `crypto` with `scrypt` hashing & cryptographic salt**: Resistant to rainbow tables, dictionary attacks, and GPU cracking.
  - **Constant-Time Verification**: Prevents side-channel timing analysis attacks using `crypto.timingSafeEqual`.
  - **Revocable Database Session Tokens**: Stored as SHA-256 token hashes in the Neon PostgreSQL `admin_sessions` table; only the raw cryptographically random token is transmitted in an `HttpOnly`, `SameSite=Lax` cookie.
  - **API Route Shielding**: All sensitive administrative endpoints (`GET/PATCH/DELETE /api/contact`, `GET /api/consultations`, `POST/DELETE /api/content`) strictly reject unauthenticated requests with HTTP 401 Unauthorized.
  - **In-App Password Management**: Logged-in administrators can change their password directly in the console via the Security modal.
- **Default Credentials**:
  - **Username / Email**: `admin` or `admin@scaleuptech.et`
  - **Initial Password**: Set via `ADMIN_PASSWORD` environment variable (or initial system default).
- **Live Content Management System (CMS)**:
  - Edit **Hero** title, tagline, description, badge text.
  - Edit **Services** details, featured Odoo deliverables, and sub-services.
  - Edit **Why Us** pillars and **Process** steps.
  - Edit **Client** audience segments.
  - Update **Contact** phone numbers, email addresses, and office locations.
  - **One-click "Save Changes to Live Site"** with live persistence to Neon PostgreSQL.
  - **"Reset to Defaults"** option to restore baseline company copy anytime.
- **Inbound Leads CRM**:
  - Search, filter by service or status, inspect customer messages.
  - Live status updater (`new`, `in_review`, `contacted`, `archived`).
  - One-click CSV export of inbound leads.
- **Consultations Schedule Manager**:
  - View all 30-minute discovery bookings with client company, date, time slot, and requirements.
- **Analytics & Database Health**:
  - Lead conversion metrics, service breakdown chart, response SLAs, and real-time database connection diagnostics.

### 4. Neon Serverless PostgreSQL Database
- Connected to **Neon Serverless PostgreSQL** via `@neondatabase/serverless` over HTTP/WebSocket pooling.
- Zero serverless connection limits, cold-start resilience, and instant autoscaling.
- Tables automatically managed:
  - `admin_users`: Verified administrator accounts, password hashes, cryptographic salts, and roles.
  - `admin_sessions`: Active, revocable sessions with expiration and client telemetry.
  - `inquiries`: Client contact submissions and CRM workflow states.
  - `consultations`: Discovery call appointments and time slots.
  - `site_content`: Dynamic CMS state persisted across all instances and deployments.
- Automatic fallback to local store if running offline without an active internet connection.

### 5. Backend REST API
- **`POST /api/auth/login`**: Authenticates admin credentials, issues secure session cookie.
- **`POST /api/auth/logout`**: Revokes session from database and clears auth cookie.
- **`GET /api/auth/me`**: Returns currently authenticated administrator.
- **`POST /api/auth/change-password`**: Updates administrator password with salt regeneration.
- **`POST /api/contact`**: Validates and records contact inquiries (Public).
- **`GET /api/contact`**: Returns list of inquiries (Protected, Admin only).
- **`PATCH /api/contact`**: Updates inquiry workflow status (Protected, Admin only).
- **`DELETE /api/contact?id=...`**: Removes an inquiry (Protected, Admin only).
- **`POST /api/consultations`**: Books 30-minute discovery calls (Public).
- **`GET /api/consultations`**: Retrieves booked appointments (Protected, Admin only).
- **`GET /api/content`**: Fetches active site copy (Public).
- **`POST /api/content`**: Saves updated site copy to Neon PostgreSQL (Protected, Admin only).
- **`DELETE /api/content`**: Resets content back to default company copy (Protected, Admin only).
- **`GET /api/stats`**: Live operational metrics and database engine identification.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ (tested with v24.12.0)
- `pnpm` (or `npm`)

### 1. Environment Setup
Create a `.env.local` file in the project root:
```env
DATABASE_URL=postgresql://neondb_owner:<YOUR_PASSWORD>@<YOUR_ENDPOINT>-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:<YOUR_PASSWORD>@<YOUR_ENDPOINT>-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Install & Run
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Or build and test production bundle locally
pnpm build
pnpm start
```

- Main Landing Page: `http://localhost:3000`
- Admin Operations & CMS: `http://localhost:3000/admin`

---

## ☁️ Deploying to Vercel

The application is configured out-of-the-box for **Vercel** (`vercel.json` included). Follow these simple steps:

### Option A: Deploy via GitHub (Recommended)

1. **Push your repository to GitHub**:
   ```bash
   git add .
   git commit -m "ScaleUp Tech PLC ready for Vercel deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** → **"Project"**.
   - Select your `scaleup` repository and click **Import**.

3. **Configure Environment Variables in Vercel**:
   Under the **Environment Variables** section, add your connection string:
   - `DATABASE_URL`: `postgresql://neondb_owner:<YOUR_PASSWORD>@<YOUR_ENDPOINT>-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - `POSTGRES_URL`: `postgresql://neondb_owner:<YOUR_PASSWORD>@<YOUR_ENDPOINT>-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require`

4. **Deploy**:
   - Click **Deploy**. Vercel will build and deploy the Next.js App Router application in under a minute!

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Log in and deploy
vercel

# Add environment variable to production
vercel env add DATABASE_URL production
vercel env add POSTGRES_URL production

# Deploy to production
vercel --prod
```

---

## 📁 Project Structure

```
scaleup/
├── app/
│   ├── admin/page.tsx             # Professional Admin portal & Dynamic CMS
│   ├── api/
│   │   ├── contact/route.ts       # Contact form API (CRUD)
│   │   ├── consultations/route.ts # Consultation booking API
│   │   ├── content/route.ts       # Site content CMS API
│   │   └── stats/route.ts         # Operational metrics & DB health API
│   ├── globals.css                # Tailwind directives & CSS design system
│   ├── layout.tsx                 # Root layout & Montserrat font configuration
│   └── page.tsx                   # Main company landing page (live CMS consumer)
├── components/
│   ├── sections/
│   │   ├── Navigation.tsx         # Clean customer header (no admin link)
│   │   ├── Hero.tsx               # Hero banner & dynamic growth chart
│   │   ├── Services.tsx           # 5 core services & featured Odoo highlight
│   │   ├── WhyUs.tsx              # 3 key value pillars
│   │   ├── Process.tsx            # 5-step delivery process
│   │   ├── Clients.tsx            # Target client segments
│   │   ├── ContactSection.tsx     # Inquiries form with live API
│   │   ├── ConsultationModal.tsx  # shadcn Dialog booking modal
│   │   └── Footer.tsx             # Footer & discrete staff portal icon
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── accordion.tsx
│       └── sonner.tsx
├── lib/
│   ├── db.ts                      # Neon PostgreSQL database engine with pooling
│   ├── types.ts                   # Type definitions & default site content
│   └── utils.ts                   # Tailwind merge & clsx utility
├── public/
│   └── images/                    # Company logos and banners
├── vercel.json                    # Vercel deployment configuration
├── .env.example                   # Neon connection template
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛡️ Security & Administration

- The public navigation bar contains zero links to administration routes.
- Access to the Content Management System and CRM is located at `/admin` and protected by passcode authentication.
- For discreet access from the main website, staff can click the small lock icon in the footer next to the copyright text.
# scaleup-web
