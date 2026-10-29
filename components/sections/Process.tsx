"use client";

import * as React from "react";
import { ProcessContent } from "@/lib/types";

interface ProcessProps {
  content?: Partial<ProcessContent>;
}

export function Process({ content }: ProcessProps) {
  const sectionTag = content?.sectionTag || "HOW WE WORK";
  const sectionTitle =
    content?.sectionTitle || "Every project follows the same five steps";

  const defaultSteps = [
    {
      step: "STEP 1",
      title: "Discover",
      description:
        "Interviews, process mapping and a requirements document you sign off.",
    },
    {
      step: "STEP 2",
      title: "Design",
      description:
        "Architecture, data model, integration plan and a fixed-scope estimate.",
    },
    {
      step: "STEP 3",
      title: "Build",
      description:
        "Short iterations, each ending with a demo and a shared backlog.",
    },
    {
      step: "STEP 4",
      title: "Launch",
      description:
        "Data migration, user training and a rehearsed cut-over.",
    },
    {
      step: "STEP 5",
      title: "Run",
      description:
        "Monitoring, backups, upgrades and a support agreement.",
    },
  ];

  const steps = content?.items || defaultSteps;

  return (
    <section id="process" className="bg-[#FFFFFF] w-full">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-[720px]">
          <div className="text-[13px] font-bold tracking-[2px] text-[#0B5FD9] uppercase">
            {sectionTag}
          </div>
          <h2 className="m-0 text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-[#0B1B4D] tracking-[-1px] leading-[1.15]">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div
                key={idx}
                className={`border-t-4 ${
                  isLast ? "border-[#1E88FF]" : "border-[#0B5FD9]"
                } pt-5 flex flex-col gap-2 bg-slate-50/50 sm:bg-transparent p-4 sm:p-0 rounded-b-xl sm:rounded-none`}
              >
                <div className="text-[13px] font-bold text-[#0B5FD9] tracking-[1.5px]">
                  {item.step}
                </div>
                <h3 className="m-0 text-[20px] font-bold text-[#0B1B4D]">
                  {item.title}
                </h3>
                <p className="m-0 text-[15px] text-[#44546F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
