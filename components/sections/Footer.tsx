"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

interface FooterProps {
  companyName?: string;
  tagline?: string;
  copyright?: string;
}

export function Footer({
  companyName = "ScaleUp Tech PLC",
  tagline = "Scaling businesses through smart software and digital innovation.",
  copyright = "© 2026 ScaleUp Tech PLC. All rights reserved.",
}: FooterProps) {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#DCE7F7] w-full">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand info */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/images/logo.png"
              alt="ScaleUp Tech PLC logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-[#0B1B4D]">
              {companyName}
            </span>
            <span className="text-sm text-[#44546F]">
              {tagline}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-[#44546F]">
          <a href="#services" className="hover:text-[#0B5FD9] transition-colors">
            Services
          </a>
          <a href="#why" className="hover:text-[#0B5FD9] transition-colors">
            Why ScaleUp
          </a>
          <a href="#process" className="hover:text-[#0B5FD9] transition-colors">
            Process
          </a>
          <a href="#clients" className="hover:text-[#0B5FD9] transition-colors">
            Clients
          </a>
          <div className="flex items-center gap-3 text-sm text-[#44546F]">
            <span>{copyright}</span>
            <Link
              href="/admin"
              className="text-slate-300 hover:text-slate-500 transition-colors p-1"
              title="Management Console"
              aria-label="Management Console"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
