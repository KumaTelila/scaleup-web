"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";

interface NavigationProps {
  onOpenConsultation?: () => void;
}

export function Navigation({ onOpenConsultation }: NavigationProps) {
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

        {/* Desktop Nav */}
        <nav
          aria-label="Main"
          className="hidden md:flex items-center gap-7 lg:gap-8 text-[15px] font-semibold text-[#0B1B4D]"
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
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-[#44546F] hover:text-[#0B5FD9] px-2.5 py-1 rounded-md hover:bg-white/60 transition-colors"
            title="Backend Management Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B5FD9]" />
            <span>Admin</span>
          </Link>
          <Button
            onClick={onOpenConsultation}
            className="bg-[#0B5FD9] hover:bg-[#084db3] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all"
          >
            Book a consultation
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
              className="py-2 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Services
            </a>
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Why ScaleUp
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Process
            </a>
            <a
              href="#clients"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0B5FD9]"
            >
              Clients
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 flex items-center gap-2 text-sm text-[#44546F] hover:text-[#0B5FD9]"
            >
              <ShieldCheck className="w-4 h-4 text-[#0B5FD9]" />
              <span>Admin Portal</span>
            </Link>
            <div className="pt-2">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenConsultation) onOpenConsultation();
                }}
                className="w-full bg-[#0B5FD9] hover:bg-[#084db3] text-white py-3 rounded-full font-bold"
              >
                Book a consultation
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
