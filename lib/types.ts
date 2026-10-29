export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  need: string;
  message: string;
  phone?: string;
  company?: string;
  status: "new" | "in_review" | "contacted" | "archived";
  createdAt: string;
  ip?: string;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string;
  time?: string;
  service: string;
  notes?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface HeroContent {
  tagline: string;
  title: string;
  highlightedText: string;
  description: string;
  badgeText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badgeOdoo: string;
  badgeCloud: string;
}

export interface ServiceCardContent {
  id: string;
  title: string;
  description: string;
}

export interface ServicesContent {
  sectionTag: string;
  sectionTitle: string;
  sectionDesc: string;
  featured: {
    badge: string;
    title: string;
    description: string;
    linkText: string;
    features: string[];
  };
  items: ServiceCardContent[];
}

export interface WhyUsPillar {
  number: string;
  title: string;
  description: string;
}

export interface WhyUsContent {
  sectionTag: string;
  sectionTitle: string;
  items: WhyUsPillar[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  sectionTag: string;
  sectionTitle: string;
  items: ProcessStep[];
}

export interface ClientSegment {
  title: string;
  tag: string;
  description: string;
}

export interface ClientsContent {
  sectionTag: string;
  sectionTitle: string;
  items: ClientSegment[];
}

export interface ContactContent {
  sectionTag: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  office: string;
  guaranteeTitle: string;
  guaranteeText: string;
}

export interface SiteContent {
  hero: HeroContent;
  services: ServicesContent;
  whyUs: WhyUsContent;
  process: ProcessContent;
  clients: ClientsContent;
  contact: ContactContent;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    tagline: "ODOO ERP · SOFTWARE · INFRASTRUCTURE",
    title: "Scaling businesses through smart software and digital innovation.",
    highlightedText: "smart software",
    description:
      "ScaleUp Tech PLC builds Odoo ERP systems, web and mobile apps, and the networks behind them, and stays with you long after go-live.",
    badgeText: "Based in Ethiopia · Working with growing businesses and institutions",
    ctaPrimary: "Book a consultation",
    ctaSecondary: "Explore services",
    badgeOdoo: "Odoo ERP",
    badgeCloud: "Cloud & infrastructure",
  },
  services: {
    sectionTag: "WHAT WE DO",
    sectionTitle: "Five services, one accountable partner",
    sectionDesc:
      "From the ERP that runs your daily operations to the network it runs on, one team designs, builds and supports it.",
    featured: {
      badge: "MAIN OFFER",
      title: "ERP built on Odoo",
      description:
        "We implement and customize Odoo so sales, inventory, accounting, HR and service run in one system, with migration, integrations, training and upgrades handled by one team.",
      linkText: "Talk about your ERP",
      features: [
        "Implementation and configuration",
        "Custom modules and integrations",
        "Data migration from your current tools",
        "User training and documentation",
        "Version upgrades and ongoing support",
      ],
    },
    items: [
      {
        id: "consulting",
        title: "IT consulting",
        description:
          "Systems assessment, digital strategy, solution architecture and technology selection, so you invest in the right tools before you build.",
      },
      {
        id: "web",
        title: "Web applications",
        description:
          "Custom web platforms, customer portals, workflow tools and e-government systems built to handle growth.",
      },
      {
        id: "mobile",
        title: "Mobile applications",
        description:
          "Android and iOS apps for customers, field teams and services, connected to your ERP and back-end systems.",
      },
      {
        id: "infrastructure",
        title: "Networking and infrastructure",
        description:
          "Network design and setup, servers, cloud hosting, security, monitoring and backups for offices and institutions.",
      },
    ],
  },
  whyUs: {
    sectionTag: "WHY SCALEUP",
    sectionTitle: "Enterprise-grade delivery with local understanding",
    items: [
      {
        number: "01",
        title: "Built for your context",
        description:
          "Local invoicing rules, payment channels, languages and approval chains are designed in from the start, not bolted on later.",
      },
      {
        number: "02",
        title: "Delivery you can follow",
        description:
          "Written requirements, short iterations with a demo each time, and a rehearsed launch with a rollback plan.",
      },
      {
        number: "03",
        title: "A partner after go-live",
        description:
          "Monitoring, backups, upgrades and support agreements with defined response times, so you are never left on your own.",
      },
    ],
  },
  process: {
    sectionTag: "HOW WE WORK",
    sectionTitle: "Every project follows the same five steps",
    items: [
      {
        step: "STEP 1",
        title: "Discover",
        description: "Interviews, process mapping and a requirements document you sign off.",
      },
      {
        step: "STEP 2",
        title: "Design",
        description: "Architecture, data model, integration plan and a fixed-scope estimate.",
      },
      {
        step: "STEP 3",
        title: "Build",
        description: "Short iterations, each ending with a demo and a shared backlog.",
      },
      {
        step: "STEP 4",
        title: "Launch",
        description: "Data migration, user training and a rehearsed cut-over.",
      },
      {
        step: "STEP 5",
        title: "Run",
        description: "Monitoring, backups, upgrades and a support agreement.",
      },
    ],
  },
  clients: {
    sectionTag: "WHO WE SERVE",
    sectionTitle: "Organizations that have outgrown spreadsheets",
    items: [
      {
        title: "Growing SMEs",
        tag: "Primary Focus",
        description:
          "One system for sales, stock, accounting and reporting, so owners see the whole business in one place.",
      },
      {
        title: "Public-sector bodies",
        tag: "Institutions & Agencies",
        description:
          "Large service platforms with workflow, audit trails and the reliability public services depend on.",
      },
      {
        title: "Mid-size enterprises",
        tag: "Multi-Department",
        description:
          "Integration across departments, careful migration and ongoing support from a team that knows your setup.",
      },
    ],
  },
  contact: {
    sectionTag: "GET IN TOUCH",
    title: "Ready to scale your operations?",
    subtitle: "Tell us about your business and we will reply with a clear next step.",
    email: "info@scaleuptech.et",
    phone: "+251 91 123 4567",
    office: "Addis Ababa, Ethiopia",
    guaranteeTitle: "ScaleUp Tech Guarantee:",
    guaranteeText:
      "Every engagement starts with documented requirements, fixed scope estimates, and direct engineering accountability.",
  },
};

