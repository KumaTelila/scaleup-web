"use client";

import * as React from "react";

export function WhyUs() {
  const pillars = [
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
  ];

  return (
    <section id="why" className="bg-[#F3F8FF] w-full border-y border-[#DCE7F7]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-[720px]">
          <div className="text-[13px] font-bold tracking-[2px] text-[#0B5FD9] uppercase">
            WHY SCALEUP
          </div>
          <h2 className="m-0 text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-[#0B1B4D] tracking-[-1px] leading-[1.15]">
            Enterprise-grade delivery with local understanding
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3.5 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border border-[#DCE7F7]/60 md:border-none shadow-sm md:shadow-none"
            >
              <div className="text-[44px] font-extrabold text-[#1E88FF] leading-none">
                {pillar.number}
              </div>
              <h3 className="m-0 text-[21px] font-bold text-[#0B1B4D]">
                {pillar.title}
              </h3>
              <p className="m-0 text-base text-[#44546F] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
