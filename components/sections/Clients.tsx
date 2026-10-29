"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Building2, Landmark, TrendingUp } from "lucide-react";
import { ClientsContent } from "@/lib/types";

interface ClientsProps {
  content?: Partial<ClientsContent>;
}

const icons = [TrendingUp, Landmark, Building2];

export function Clients({ content }: ClientsProps) {
  const sectionTag = content?.sectionTag || "WHO WE SERVE";
  const sectionTitle =
    content?.sectionTitle || "Organizations that have outgrown spreadsheets";

  const defaultSegments = [
    {
      title: "Growing SMEs",
      description:
        "One system for sales, stock, accounting and reporting, so owners see the whole business in one place.",
      tag: "Primary Focus",
    },
    {
      title: "Public-sector bodies",
      description:
        "Large service platforms with workflow, audit trails and the reliability public services depend on.",
      tag: "Institutions & Agencies",
    },
    {
      title: "Mid-size enterprises",
      description:
        "Integration across departments, careful migration and ongoing support from a team that knows your setup.",
      tag: "Multi-Department",
    },
  ];

  const segments = content?.items || defaultSegments;

  return (
    <section id="clients" className="bg-[#F3F8FF] w-full border-t border-[#DCE7F7]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-[720px]">
          <div className="text-[13px] font-bold tracking-[2px] text-[#0B5FD9] uppercase">
            {sectionTag}
          </div>
          <h2 className="m-0 text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-[#0B1B4D] tracking-[-1px] leading-[1.15]">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {segments.map((segment, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <Card
                key={idx}
                className="bg-[#FFFFFF] border border-[#DCE7F7] rounded-[20px] p-8 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#0B5FD9]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#0B5FD9] flex items-center justify-center">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-[#44546F] rounded-full">
                    {segment.tag}
                  </span>
                </div>
                <h3 className="m-0 text-[22px] font-bold text-[#0B1B4D]">
                  {segment.title}
                </h3>
                <p className="m-0 text-base text-[#44546F] leading-relaxed">
                  {segment.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
