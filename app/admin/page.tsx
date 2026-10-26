"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  Inbox,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { ContactInquiry, ConsultationBooking } from "@/lib/db";
import { toast } from "sonner";

export default function AdminPage() {
  const [inquiries, setInquiries] = React.useState<ContactInquiry[]>([]);
  const [consultations, setConsultations] = React.useState<ConsultationBooking[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"inquiries" | "consultations" | "analytics">("inquiries");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resInq, resCons, resStats] = await Promise.all([
        fetch("/api/contact"),
        fetch("/api/consultations"),
        fetch("/api/stats"),
      ]);

      const dataInq = await resInq.json();
      const dataCons = await resCons.json();
      const dataStats = await resStats.json();

      if (dataInq.success) setInquiries(dataInq.inquiries);
      if (dataCons.success) setConsultations(dataCons.consultations);
      if (dataStats.success) setStats(dataStats.stats);
    } catch (err) {
      toast.error("Error loading admin data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Inquiry removed");
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete inquiry");
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.need.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#0B1B4D]">
      {/* Top Banner */}
      <div className="bg-[#0B1B4D] text-white border-b border-blue-900/60 sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold transition-colors bg-white/10 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </Link>
            <div className="h-4 w-px bg-blue-800 hidden sm:block" />
            <h1 className="text-xl font-extrabold tracking-tight">
              ScaleUp Tech PLC · Operations Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="bg-transparent text-white border-white/30 hover:bg-white/10 rounded-full text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="bg-white border-[#DCE7F7]">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#44546F]">Total Inquiries</p>
                  <p className="text-3xl font-extrabold text-[#0B1B4D] mt-1">
                    {stats.totalInquiries}
                  </p>
                  <span className="text-xs text-[#0B5FD9] font-semibold mt-1 inline-block">
                    {stats.newInquiries} requiring follow-up
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#0B5FD9] flex items-center justify-center">
                  <Inbox className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#DCE7F7]">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#44546F]">Booked Consultations</p>
                  <p className="text-3xl font-extrabold text-[#0B1B4D] mt-1">
                    {stats.activeConsultations}
                  </p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                    Confirmed appointments
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#DCE7F7]">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#44546F]">Primary Demand</p>
                  <p className="text-2xl font-extrabold text-[#0B1B4D] mt-1 truncate">
                    ERP (Odoo)
                  </p>
                  <span className="text-xs text-[#44546F] font-semibold mt-1 inline-block">
                    {stats.byService?.odoo || 0} leads ({Math.round(((stats.byService?.odoo || 1) / (stats.totalInquiries || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#F3F8FF] text-[#1E88FF] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#DCE7F7]">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#44546F]">Average SLA Response</p>
                  <p className="text-3xl font-extrabold text-emerald-700 mt-1">
                    {stats.averageResponseTime}
                  </p>
                  <span className="text-xs text-[#44546F] font-semibold mt-1 inline-block">
                    Target: &lt; 24h
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-[#DCE7F7] pb-3">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeTab === "inquiries"
                ? "bg-[#0B5FD9] text-white shadow-sm"
                : "text-[#44546F] hover:bg-slate-200"
            }`}
          >
            Inbound Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("consultations")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeTab === "consultations"
                ? "bg-[#0B5FD9] text-white shadow-sm"
                : "text-[#44546F] hover:bg-slate-200"
            }`}
          >
            Consultation Appointments ({consultations.length})
          </button>
        </div>

        {/* INQUIRIES TAB */}
        {activeTab === "inquiries" && (
          <div className="flex flex-col gap-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DCE7F7] shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client name, email, company, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-10 text-xs font-semibold rounded-xl">
                    <SelectValue placeholder="Status filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">New leads</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inquiries list */}
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#DCE7F7]">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-[#0B1B4D]">No inquiries found</p>
                <p className="text-sm text-[#44546F]">No records matched your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.map((inq) => (
                  <Card
                    key={inq.id}
                    className="bg-white border-[#DCE7F7] p-6 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start"
                  >
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-bold text-[#0B1B4D]">
                          {inq.name}
                        </span>
                        <Badge
                          variant={
                            inq.status === "new"
                              ? "default"
                              : inq.status === "contacted"
                              ? "primary"
                              : inq.status === "in_review"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[11px]"
                        >
                          {inq.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="navy" className="text-[11px]">
                          {inq.need}
                        </Badge>
                        <span className="text-xs text-[#44546F] ml-auto">
                          {new Date(inq.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-sm text-[#44546F]">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-[#0B5FD9]" />
                          <a
                            href={`mailto:${inq.email}`}
                            className="hover:underline text-[#0B5FD9] font-medium"
                          >
                            {inq.email}
                          </a>
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-[#0B5FD9]" />
                            <a href={`tel:${inq.phone}`} className="hover:underline">
                              {inq.phone}
                            </a>
                          </span>
                        )}
                        {inq.company && (
                          <span className="flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-[#0B5FD9]" />
                            <span>{inq.company}</span>
                          </span>
                        )}
                      </div>

                      <div className="bg-[#F3F8FF] p-4 rounded-xl border border-[#DCE7F7]/60 text-sm text-[#0B1B4D] leading-relaxed">
                        {inq.message}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <Select
                        value={inq.status}
                        onValueChange={(val) => handleUpdateStatus(inq.id, val)}
                      >
                        <SelectTrigger className="w-[140px] h-9 text-xs font-semibold rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_review">In Review</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(inq.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2.5 h-8"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONSULTATIONS TAB */}
        {activeTab === "consultations" && (
          <div className="flex flex-col gap-4">
            {consultations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#DCE7F7]">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-[#0B1B4D]">No consultations scheduled yet</p>
                <p className="text-sm text-[#44546F]">
                  Consultation bookings made from the website will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {consultations.map((cons) => (
                  <Card key={cons.id} className="bg-white border-[#DCE7F7] p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="font-bold text-lg text-[#0B1B4D]">{cons.name}</span>
                      <Badge variant="default" className="bg-[#1E88FF] text-[#0B1B4D]">
                        {cons.service}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-2.5 py-4 text-sm text-[#44546F]">
                      <div className="flex items-center gap-2 font-semibold text-[#0B1B4D]">
                        <Calendar className="w-4 h-4 text-[#0B5FD9]" />
                        <span>Date: {cons.date}</span>
                        <Clock className="w-4 h-4 text-[#0B5FD9] ml-2" />
                        <span>{cons.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#0B5FD9]" />
                        <a href={`mailto:${cons.email}`} className="text-[#0B5FD9] hover:underline">
                          {cons.email}
                        </a>
                      </div>

                      {cons.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#0B5FD9]" />
                          <span>{cons.phone}</span>
                        </div>
                      )}

                      {cons.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#0B5FD9]" />
                          <span>{cons.company}</span>
                        </div>
                      )}

                      {cons.notes && (
                        <div className="mt-2 bg-[#F3F8FF] p-3 rounded-lg text-xs text-[#0B1B4D]">
                          <strong>Notes:</strong> {cons.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#44546F]">
                      <span>Status: <strong className="text-emerald-600 uppercase">{cons.status}</strong></span>
                      <span className="text-[11px]">Booked on {new Date(cons.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
