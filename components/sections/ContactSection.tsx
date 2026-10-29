"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ContactContent } from "@/lib/types";

interface ContactSectionProps {
  selectedNeed?: string;
  content?: Partial<ContactContent>;
}

export function ContactSection({ selectedNeed = "ERP (Odoo)", content }: ContactSectionProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [need, setNeed] = React.useState(selectedNeed);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const sectionTag = content?.sectionTag || "GET IN TOUCH";
  const title = content?.title || "Ready to scale your operations?";
  const subtitle = content?.subtitle || "Tell us about your business and we will reply with a clear next step.";
  const displayEmail = content?.email || "info@scaleuptech.et";
  const displayPhone = content?.phone || "+251 91 123 4567";
  const displayOffice = content?.office || "Addis Ababa, Ethiopia";
  const guaranteeTitle = content?.guaranteeTitle || "ScaleUp Tech Guarantee:";
  const guaranteeText =
    content?.guaranteeText ||
    "Every engagement starts with documented requirements, fixed scope estimates, and direct engineering accountability.";

  React.useEffect(() => {
    if (selectedNeed) {
      setNeed(selectedNeed);
    }
  }, [selectedNeed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please tell us about your project requirements.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          need,
          message,
          phone,
          company,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setSubmitted(true);
      toast.success("Message received!", {
        description: "Our engineering lead will reach out to you within 24 hours.",
      });

      // Clear inputs
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      toast.error("Submission failed", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-[#0B1B4D] to-[#0B3FA8] text-white w-full"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24 flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
        {/* Left Column Information */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="text-[13px] font-bold tracking-[2px] text-[#8EC3FF] uppercase">
            {sectionTag}
          </div>

          <h2 className="m-0 text-[30px] sm:text-[36px] md:text-[44px] font-extrabold tracking-[-1px] leading-[1.15] text-white">
            {title}
          </h2>

          <p className="m-0 text-[17px] text-[#C9D8F5] leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col gap-3.5 text-base font-medium pt-3 text-slate-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#8EC3FF]" />
              <span>Email: {displayEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#8EC3FF]" />
              <span>Phone: {displayPhone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#8EC3FF]" />
              <span>Office: {displayOffice}</span>
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 max-w-[420px]">
            <p className="text-sm text-slate-200 m-0">
              <strong className="text-white block mb-1">{guaranteeTitle}</strong>
              {guaranteeText}
            </p>
          </div>
        </div>

        {/* Right Column Form */}
        <div className="flex-1 min-w-0 w-full max-w-[540px]">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-[#0B1B4D] rounded-[24px] p-8 md:p-10 flex flex-col gap-4 shadow-2xl border border-white/20"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1B4D]">
                  Thank you!
                </h3>
                <p className="text-[#44546F] text-base max-w-sm">
                  Your message has been safely saved in our backend system. Our team will review your requirements and respond promptly.
                </p>
                <Button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="rounded-full mt-2"
                >
                  Send another inquiry
                </Button>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="text-sm font-bold text-[#0B1B4D]">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="f-name"
                    type="text"
                    placeholder="e.g. Dawit Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-email" className="text-sm font-bold text-[#0B1B4D]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="f-email"
                    type="email"
                    placeholder="e.g. dawit@company.et"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-phone" className="text-sm font-bold text-[#0B1B4D]">
                      Phone number (optional)
                    </label>
                    <Input
                      id="f-phone"
                      type="tel"
                      placeholder="+251 9..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-company" className="text-sm font-bold text-[#0B1B4D]">
                      Company / Organization
                    </label>
                    <Input
                      id="f-company"
                      type="text"
                      placeholder="Organization name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-need" className="text-sm font-bold text-[#0B1B4D]">
                    What do you need?
                  </label>
                  <Select value={need} onValueChange={setNeed}>
                    <SelectTrigger id="f-need">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ERP (Odoo)">ERP (Odoo)</SelectItem>
                      <SelectItem value="IT consulting">IT consulting</SelectItem>
                      <SelectItem value="Web application">Web application</SelectItem>
                      <SelectItem value="Mobile application">Mobile application</SelectItem>
                      <SelectItem value="Networking and infrastructure">
                        Networking and infrastructure
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-msg" className="text-sm font-bold text-[#0B1B4D]">
                    Tell us about your project <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="f-msg"
                    rows={4}
                    placeholder="Briefly describe your current setup and what you are looking to build or scale..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0B5FD9] hover:bg-[#084db3] text-white font-bold text-base py-4 rounded-full shadow-md"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending message...
                      </span>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
