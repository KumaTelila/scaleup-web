"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Compass, Monitor, Smartphone, Server } from "lucide-react";

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export function Services({ onSelectService }: ServicesProps) {
  const odooFeatures = [
    "Implementation and configuration",
    "Custom modules and integrations",
    "Data migration from your current tools",
    "User training and documentation",
    "Version upgrades and ongoing support",
  ];

  const secondaryServices = [
    {
      title: "IT consulting",
      description:
        "Systems assessment, digital strategy, solution architecture and technology selection, so you invest in the right tools before you build.",
      icon: Compass,
    },
    {
      title: "Web applications",
      description:
        "Custom web platforms, customer portals, workflow tools and e-government systems built to handle growth.",
      icon: Monitor,
    },
    {
      title: "Mobile applications",
      description:
        "Android and iOS apps for customers, field teams and services, connected to your ERP and back-end systems.",
      icon: Smartphone,
    },
    {
      title: "Networking and infrastructure",
      description:
        "Network design and setup, servers, cloud hosting, security, monitoring and backups for offices and institutions.",
      icon: Server,
    },
  ];

  return (
    <section id="services" className="bg-[#FFFFFF] w-full">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24 flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-3 max-w-[720px]">
          <div className="text-[13px] font-bold tracking-[2px] text-[#0B5FD9] uppercase">
            WHAT WE DO
          </div>
          <h2 className="m-0 text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-[#0B1B4D] tracking-[-1px] leading-[1.15]">
            Five services, one accountable partner
          </h2>
          <p className="m-0 text-[17px] text-[#44546F] leading-relaxed">
            From the ERP that runs your daily operations to the network it runs
            on, one team designs, builds and supports it.
          </p>
        </div>

        {/* Featured Main Offer - Odoo ERP */}
        <div className="bg-[#0B1B4D] text-[#FFFFFF] rounded-[24px] p-8 md:p-12 flex flex-col lg:flex-row gap-10 shadow-xl border border-blue-900/40">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="self-start">
              <Badge
                variant="default"
                className="bg-[#1E88FF] text-[#0B1B4D] font-extrabold text-xs tracking-[1.5px] px-3.5 py-1.5 rounded-full"
              >
                MAIN OFFER
              </Badge>
            </div>
            <h3 className="m-0 text-[28px] sm:text-[32px] font-extrabold tracking-[-0.5px] leading-[1.2] text-white">
              ERP built on Odoo
            </h3>
            <p className="m-0 text-[17px] text-[#C9D8F5] leading-relaxed">
              We implement and customize Odoo so sales, inventory, accounting, HR
              and service run in one system, with migration, integrations,
              training and upgrades handled by one team.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => onSelectService && onSelectService("ERP (Odoo)")}
                className="inline-block text-white font-bold text-base border-b-2 border-[#1E88FF] pb-1 hover:text-[#1E88FF] transition-colors"
              >
                Talk about your ERP →
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-3.5 text-base font-medium text-slate-100">
            {odooFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1E88FF]/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#6FB3FF] stroke-[2.5]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Secondary Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryServices.map((svc, idx) => {
            const IconComponent = svc.icon;
            return (
              <Card
                key={idx}
                className="border border-[#DCE7F7] rounded-[20px] p-7 flex flex-col gap-3.5 hover:border-[#1E88FF] transition-all bg-white hover:-translate-y-1 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E6F0FF] text-[#0B5FD9] flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="m-0 text-xl font-bold text-[#0B1B4D]">
                  {svc.title}
                </h3>
                <p className="m-0 text-[15px] text-[#44546F] leading-relaxed">
                  {svc.description}
                </p>
                <div className="pt-2 mt-auto">
                  <a
                    href="#contact"
                    onClick={() => onSelectService && onSelectService(svc.title)}
                    className="text-sm font-bold text-[#0B5FD9] hover:underline flex items-center gap-1"
                  >
                    Inquire about {svc.title.split(" ")[0]} →
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
