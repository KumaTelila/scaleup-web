"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onOpenConsultation?: () => void;
  ctaText?: string;
}

export function Navigation({ onOpenConsultation, ctaText = "Book a consultation" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F3F8FF] border-b border-[#DCE7F7]/60 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="#top"
          className="flex items-center gap-3 text-[#0B1B4D] group transition-opacity hover:opacity-90"
        >
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/images/logo.png"
              alt="ScaleUp Tech PLC logo mark"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="flex flex-col leading-tight">
            <span className="text-[22px] font-extrabold tracking-[-0.5px] text-[#0B1B4D]">
              ScaleUp
            </span>
            <span className="text-[13px] font-semibold tracking-[1.5px] text-[#0B5FD9]">
              Tech PLC
            </span>
          </span>
        </Link>

        {/* Desktop Nav - Clean, professional, customer-focused without internal Admin link */}
        <nav
          aria-label="Main"
          className="hidden md:flex items-center gap-8 lg:gap-9 text-[15px] font-semibold text-[#0B1B4D]"
        >
          <a
            href="#services"
            className="transition-colors hover:text-[#0B5FD9]"
          >
            Services
          </a>
          <a
            href="#why"
            className="transition-colors hover:text-[#0B5FD9]"
          >
            Why ScaleUp
          </a>
          <a
            href="#process"
            className="transition-colors hover:text-[#0B5FD9]"
          >
            Process
          </a>
          <a
            href="#clients"
            className="transition-colors hover:text-[#0B5FD9]"
          >
            Clients
          </a>
          <Button
            onClick={onOpenConsultation}
            className="bg-[#0B5FD9] hover:bg-[#084db3] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all"
          >
            {ctaText}
          </Button>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="text-[#0B1B4D]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCE7F7] px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-semibold text-[#0B1B4D]">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Services
            </a>
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Why ScaleUp
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Process
            </a>
            <a
              href="#clients"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Clients
            </a>
            <div className="pt-2">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenConsultation) onOpenConsultation();
                }}
                className="w-full bg-[#0B5FD9] hover:bg-[#084db3] text-white py-3 rounded-full font-bold"
              >
                {ctaText}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
