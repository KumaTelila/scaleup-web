"use client";

import * as React from "react";
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Clients } from "@/components/sections/Clients";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { ConsultationModal } from "@/components/sections/ConsultationModal";

export default function HomePage() {
  const [consultationOpen, setConsultationOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState("ERP (Odoo)");

  const handleOpenConsultation = (service = "ERP (Odoo)") => {
    setSelectedService(service);
    setConsultationOpen(true);
  };

  const handleSelectServiceFromSection = (serviceName: string) => {
    setSelectedService(serviceName);
    // Smooth scroll down to contact section
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col font-sans text-[#0B1B4D] bg-white selection:bg-[#0B5FD9] selection:text-white">
      {/* Navigation Header */}
      <Navigation onOpenConsultation={() => handleOpenConsultation("ERP (Odoo)")} />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <Hero onOpenConsultation={() => handleOpenConsultation("ERP (Odoo)")} />

        {/* SERVICES SECTION */}
        <Services onSelectService={handleSelectServiceFromSection} />

        {/* WHY SCALEUP SECTION */}
        <WhyUs />

        {/* PROCESS SECTION */}
        <Process />

        {/* CLIENTS SECTION */}
        <Clients />

        {/* CONTACT SECTION WITH LIVE BACKEND FORM */}
        <ContactSection selectedNeed={selectedService} />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* INTERACTIVE CONSULTATION DIALOG */}
      <ConsultationModal
        open={consultationOpen}
        onOpenChange={setConsultationOpen}
        defaultService={selectedService}
      />
    </div>
  );
}
