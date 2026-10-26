"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenConsultation?: () => void;
}

export function Hero({ onOpenConsultation }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-[#F3F8FF] to-[#FFFFFF] w-full border-b border-[#DCE7F7]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        {/* Left Column Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 text-left">
          <div className="text-[13px] font-bold tracking-[2px] text-[#0B5FD9] uppercase">
            ODOO ERP · SOFTWARE · INFRASTRUCTURE
          </div>

          <h1 className="m-0 text-[36px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-extrabold text-[#0B1B4D] leading-[1.08] tracking-[-1.5px]">
            Scaling businesses through{" "}
            <span className="text-[#0B5FD9]">smart software</span> and digital
            innovation.
          </h1>

          <p className="m-0 text-lg md:text-[19px] text-[#44546F] max-w-[560px] leading-relaxed">
            ScaleUp Tech PLC builds Odoo ERP systems, web and mobile apps, and
            the networks behind them, and stays with you long after go-live.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              onClick={onOpenConsultation}
              className="bg-[#0B5FD9] hover:bg-[#084db3] text-white font-bold text-base px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Book a consultation
            </Button>
            <a href="#services">
              <Button
                variant="outline"
                className="bg-white text-[#0B1B4D] hover:bg-[#F3F8FF] font-bold text-base px-7 py-4 rounded-full border-2 border-[#0B1B4D]"
              >
                Explore services
              </Button>
            </a>
          </div>

          <div className="text-sm font-semibold text-[#44546F] pt-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Based in Ethiopia · Working with growing businesses and institutions
          </div>
        </div>

        {/* Right Column Illustration */}
        <div className="flex-1 min-w-0 w-full max-w-[520px] relative">
          <div className="relative rounded-[28px] overflow-hidden bg-[#EAF3FF] p-6 sm:p-8 shadow-inner border border-[#DCE7F7]/60">
            <svg
              viewBox="0 0 520 440"
              role="img"
              aria-label="Rising bars and an upward arrow, representing business growth"
              className="w-full h-auto block drop-shadow-sm"
            >
              <rect x="0" y="0" width="520" height="440" rx="28" fill="#EAF3FF" />
              <rect x="44" y="280" width="72" height="110" rx="8" fill="#E1EEFF" />
              <rect x="136" y="220" width="72" height="170" rx="8" fill="#C4DDFF" />
              <rect x="228" y="150" width="72" height="240" rx="8" fill="#A3CBFF" />
              <rect x="320" y="90" width="72" height="300" rx="8" fill="#7DB6FF" />
              <path
                d="M60 340 C 170 310, 300 230, 410 120"
                fill="none"
                stroke="#0B5FD9"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <polygon points="396,72 462,58 436,126" fill="#0B5FD9" />
            </svg>

            {/* Badges placed on illustration */}
            <div className="absolute top-6 left-6 bg-white border border-[#DCE7F7] rounded-full px-4 py-2 text-sm font-bold text-[#0B1B4D] shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B5FD9]"></span>
              Odoo ERP
            </div>
            <div className="absolute bottom-6 right-6 bg-white border border-[#DCE7F7] rounded-full px-4 py-2 text-sm font-bold text-[#0B1B4D] shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E88FF]"></span>
              Cloud & infrastructure
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
