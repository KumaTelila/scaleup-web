"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}

export function ConsultationModal({
  open,
  onOpenChange,
  defaultService = "ERP (Odoo)",
}: ConsultationModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [service, setService] = React.useState(defaultService);
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00 AM");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (defaultService) {
      setService(defaultService);
    }
  }, [defaultService]);

  // Set default date to tomorrow
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          service,
          date,
          time,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to schedule consultation.");
      }

      setSuccess(true);
      toast.success("Consultation booked!", {
        description: data.message,
      });
    } catch (err: any) {
      toast.error("Booking error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0B1B4D]">
            Schedule an Engineering Consultation
          </DialogTitle>
          <DialogDescription className="text-base text-[#44546F]">
            Book a 30-minute discovery call with ScaleUp Tech PLC specialists to review your workflow and technical roadmap.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-[#0B1B4D]">
              Consultation Scheduled!
            </h4>
            <p className="text-sm text-[#44546F] max-w-sm">
              We have received your appointment request for <strong>{date}</strong> at <strong>{time}</strong>. An invite has been queued for <strong>{email}</strong>.
            </p>
            <Button
              onClick={resetAndClose}
              className="mt-2 bg-[#0B5FD9] text-white rounded-full px-6"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D]">Your Name *</label>
                <Input
                  required
                  placeholder="Kuma Telila"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D]">Work Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="name@company.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D]">Phone Number</label>
                <Input
                  placeholder="+251 9..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D]">Company / Organization</label>
                <Input
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D]">Service Focus</label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERP (Odoo)">ERP built on Odoo</SelectItem>
                  <SelectItem value="IT consulting">IT Consulting & Architecture</SelectItem>
                  <SelectItem value="Web application">Custom Web Applications</SelectItem>
                  <SelectItem value="Mobile application">Mobile Apps (iOS & Android)</SelectItem>
                  <SelectItem value="Networking and infrastructure">
                    Networking & Infrastructure
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0B5FD9]" />
                  Preferred Date *
                </label>
                <Input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0B1B4D] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0B5FD9]" />
                  Preferred Time
                </label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM EAT</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM EAT</SelectItem>
                    <SelectItem value="11:30 AM">11:30 AM EAT</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM EAT</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM EAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D]">
                Project Scope / Key Questions
              </label>
              <Textarea
                rows={3}
                placeholder="Share any background details on your current operations or systems..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0B5FD9] hover:bg-[#084db3] text-white rounded-full px-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

