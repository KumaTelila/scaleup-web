# ScaleUp Tech PLC — Enterprise Website & Operations Backend

Modern, high-performance website and backend for **ScaleUp Tech PLC** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

This project faithfully preserves the original design, exact copy, brand identity, and color palette from `ScaleUp Tech PLC Website.html` while introducing a fully functional backend for lead capture, consultation scheduling, and administrative operations.

---

## 🚀 Key Features

### 1. Pixel-Perfect HTML & Brand Preservation
- **Header & Navigation**: Sticky header with logo mark, branded typography (`ScaleUp` in `#0B1B4D`, `Tech PLC` in `#0B5FD9`), smooth scroll anchors, and responsive mobile menu.
- **Hero Section**: Tagline (`ODOO ERP · SOFTWARE · INFRASTRUCTURE`), headline, value proposition, CTAs, and SVG business growth illustration with floating badges.
- **Services ("What We Do")**:
  - **Featured Card (Odoo ERP)**: Dark navy hero card with 5 delivery checkmarks and direct inquiry button.
  - **Secondary Cards**: IT Consulting, Web Applications, Mobile Applications, and Networking & Infrastructure.
- **Why ScaleUp**: 3 core value pillars (01 Built for your context, 02 Delivery you can follow, 03 A partner after go-live).
- **Process ("How We Work")**: 5-stage delivery model (Discover, Design, Build, Launch, Run).
- **Clients ("Who We Serve")**: Growing SMEs, Public-sector bodies, and Mid-size enterprises.
- **Contact & Inquiries**: Branded gradient section with company contact details and interactive form.
- **Footer**: Company overview, links, admin link, and copyright notice.

### 2. shadcn/ui Components Integration
- **`Button`**: Branded variants (`default`, `navy`, `outline`, `secondary`, `ghost`, `link`, `accent`).
- **`Card`**: Custom rounded cards with `#DCE7F7` borders and subtle elevation.
- **`Input` & `Textarea`**: Custom styled inputs with `#9FB3D1` borders and `#1E88FF` focus rings.
- **`Select`**: Radix-powered dropdown with animated checkmarks and clean popover transitions.
- **`Badge`**: Pill-shaped status indicators and service badges.
- **`Dialog`**: Interactive discovery session scheduler modal.
- **`Toaster` (Sonner)**: Real-time feedback on inquiry submissions and status updates.

### 3. Backend Architecture & Endpoints
- **`POST /api/contact`**: Validates and records contact inquiries.
- **`GET /api/contact`**: Returns list of inquiries (supports filtering).
- **`PATCH /api/contact`**: Updates inquiry workflow status (`new`, `in_review`, `contacted`, `archived`).
- **`DELETE /api/contact?id=...`**: Removes an inquiry.
- **`POST /api/consultations`**: Books 30-minute discovery calls with date, time, and service selection.
- **`GET /api/consultations`**: Retrieves booked appointments.
- **`GET /api/stats`**: Live operational stats (total leads, open inquiries, service breakdown, SLAs).

### 4. Admin Operations Portal (`/admin`)
- Accessible directly via the navigation bar and footer.
- Real-time dashboard showing incoming leads and booked consultations.
- Interactive status changer (mark leads as In Review, Contacted, or Archived).
- Search and filter by client name, company, email, or service focus.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (tested with v24.12.0)
- `pnpm` (or `npm`)

### Installation & Run

```bash
# Start development server
pnpm dev
# (or specify port if 3000 is occupied: pnpm dev -p 3002)

# Build for production
pnpm build

# Start production server
pnpm start -p 3002
```

Open [http://localhost:3002](http://localhost:3002) in your browser.
Open [http://localhost:3002/admin](http://localhost:3002/admin) to view the Admin Operations Portal.

---

## 📁 Project Structure

```
scaleup/
├── app/
│   ├── admin/page.tsx             # Admin operations dashboard
│   ├── api/
│   │   ├── contact/route.ts       # Contact form API
│   │   ├── consultations/route.ts # Consultation booking API
│   │   └── stats/route.ts         # Operational metrics API
│   ├── globals.css                # Tailwind directives & CSS variables
│   ├── layout.tsx                 # Root layout & Montserrat font
│   └── page.tsx                   # Main company landing page
├── components/
│   ├── sections/
│   │   ├── Navigation.tsx         # Header navigation & mobile drawer
│   │   ├── Hero.tsx               # Hero banner & growth graphic
│   │   ├── Services.tsx           # 5 core services & Odoo highlight
│   │   ├── WhyUs.tsx              # 3 key differentiators
│   │   ├── Process.tsx            # 5-step delivery process
│   │   ├── Clients.tsx            # Target client segments
│   │   ├── ContactSection.tsx     # Inquiries form with live API
│   │   ├── ConsultationModal.tsx  # shadcn Dialog booking modal
│   │   └── Footer.tsx             # Footer & company details
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
├── data/
│   └── scaleup_store.json         # Persistent JSON database
├── lib/
│   ├── db.ts                      # Backend database controller
│   └── utils.ts                   # Tailwind merge & clsx utility
├── public/
│   └── images/                    # Company logos and banners
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

# ScaleUp-website
