"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ExternalLink,
  Edit3,
  Save,
  RotateCcw,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  Lock,
  LogOut,
  Sliders,
  HelpCircle,
  Download,
  Eye,
  EyeOff,
  Key,
  User,
  ShieldAlert,
  LockKeyhole,
} from "lucide-react";
import {
  ContactInquiry,
  ConsultationBooking,
  SiteContent,
  DEFAULT_SITE_CONTENT,
  AdminUser,
} from "@/lib/types";
import { toast } from "sonner";

export default function AdminPage() {
  // Authentication states
  const [currentUser, setCurrentUser] = React.useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = React.useState(true);
  const [loginIdentifier, setLoginIdentifier] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  // Password change modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [currentPass, setCurrentPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [changingPassword, setChangingPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  // Data states
  const [inquiries, setInquiries] = React.useState<ContactInquiry[]>([]);
  const [consultations, setConsultations] = React.useState<ConsultationBooking[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Navigation tabs
  const [activeTab, setActiveTab] = React.useState<"cms" | "inquiries" | "consultations" | "analytics">("cms");

  // CMS Sub-sections
  const [cmsSection, setCmsSection] = React.useState<
    "hero" | "services" | "whyUs" | "process" | "clients" | "contact"
  >("hero");

  // Editable Site Content
  const [content, setContent] = React.useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [savingCms, setSavingCms] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Inquiries Filters
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Check existing session on load
  React.useEffect(() => {
    const checkAuth = async () => {
      setAuthChecking(true);
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError("Please enter your username/email and password.");
      return;
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setLoginPassword("");
        setLoginError(null);
        toast.success(`Welcome back, ${data.user.name || "Administrator"}!`);
      } else {
        setLoginError(data.error || "Invalid username or password");
        toast.error(data.error || "Authentication failed");
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication server");
      toast.error("Network error during login");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {}
    setCurrentUser(null);
    setInquiries([]);
    setConsultations([]);
    setStats(null);
    toast.info("Logged out of Operations Console");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully!");
        setIsPasswordModalOpen(false);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error communicating with security service");
    } finally {
      setChangingPassword(false);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resInq, resCons, resStats, resContent] = await Promise.all([
        fetch("/api/contact"),
        fetch("/api/consultations"),
        fetch("/api/stats"),
        fetch("/api/content"),
      ]);

      const dataInq = await resInq.json();
      const dataCons = await resCons.json();
      const dataStats = await resStats.json();
      const dataContent = await resContent.json();

      if (dataInq.success) setInquiries(dataInq.inquiries || []);
      if (dataCons.success) setConsultations(dataCons.consultations || []);
      if (dataStats.success) setStats(dataStats.stats);
      if (dataContent.success && dataContent.content) {
        setContent(dataContent.content);
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      toast.error("Error loading administrative data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Save CMS Content
  const handleSaveContent = async () => {
    setSavingCms(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Website content saved!", {
          description: "All changes are now live on the public website.",
        });
        setHasUnsavedChanges(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error("Failed to save content", {
        description: err.message,
      });
    } finally {
      setSavingCms(false);
    }
  };

  // Reset CMS Content
  const handleResetContent = async () => {
    if (!confirm("Are you sure you want to reset all website content to original defaults?")) {
      return;
    }
    setSavingCms(true);
    try {
      const res = await fetch("/api/content", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
        setHasUnsavedChanges(false);
        toast.success("Content restored to original defaults");
      }
    } catch (err) {
      toast.error("Failed to reset content");
    } finally {
      setSavingCms(false);
    }
  };

  // Lead status update
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
      toast.error("Failed to update lead status");
    }
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry record?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Inquiry removed from system");
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete inquiry");
    }
  };

  // Export leads to CSV
  const exportInquiriesToCSV = () => {
    if (inquiries.length === 0) {
      toast.info("No inquiries to export");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Service Needed", "Status", "Date", "Message"];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      i.phone || "",
      `"${(i.company || "").replace(/"/g, '""')}"`,
      i.need,
      i.status,
      i.createdAt,
      `"${i.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scaleup_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported leads to CSV");
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

  // CMS Helper to update nested state
  const updateCmsField = (section: keyof SiteContent, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#F3F8FF] flex items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-14 w-14 animate-pulse">
            <Image
              src="/images/logo.png"
              alt="ScaleUp Tech PLC"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#0B1B4D] font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin text-[#0B5FD9]" />
            <span>Verifying secure administrative session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F3F8FF] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-[#DCE7F7] rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative h-14 w-14">
              <Image
                src="/images/logo.png"
                alt="ScaleUp Tech PLC logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#0B1B4D]">
                ScaleUp Tech PLC
              </h2>
              <p className="text-xs font-semibold tracking-wider text-[#0B5FD9] uppercase mt-0.5">
                Operations & CMS Console
              </p>
            </div>
            <p className="text-sm text-[#44546F] mt-1">
              Protected administrative area. Sign in with your verified credentials to manage website contents, inquiries, and schedules.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0B5FD9]" />
                Username or Email
              </label>
              <Input
                type="text"
                placeholder="admin or admin@scaleuptech.et"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className={loginError ? "border-red-500" : ""}
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0B5FD9]" />
                  Password
                </span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter administrator password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`pr-10 ${loginError ? "border-red-500" : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {loginError}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="bg-[#0B5FD9] hover:bg-[#084db3] text-white font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Console</span>
                </>
              )}
            </Button>

            <div className="pt-2 flex items-center justify-between text-xs text-[#44546F]">
              <Link href="/" className="hover:text-[#0B5FD9] flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Website
              </Link>
              <span className="text-[11px] text-slate-400">
                Neon DB Protected
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#0B1B4D] font-sans">
      {/* Enterprise Top Navigation Bar */}
      <header className="bg-[#0B1B4D] text-white border-b border-blue-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 bg-white/10 rounded-lg p-1 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="ScaleUp Tech PLC"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-tight">ScaleUp Tech PLC</span>
                <span className="text-[11px] font-semibold tracking-wider text-[#6FB3FF] uppercase">
                  Management & CMS Console
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-blue-800 hidden md:block" />

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Live System Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-[#1E88FF] text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-none">{currentUser?.name || "Administrator"}</span>
                <span className="text-[10px] text-slate-300 leading-none mt-0.5">{currentUser?.email}</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 text-[10px] px-1.5 py-0 h-4 border border-emerald-500/30 font-mono uppercase">
                {currentUser?.role || "superadmin"}
              </Badge>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-colors border border-white/10"
              title="Open public website in a new tab"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-transparent text-white border-white/25 hover:bg-white/10 rounded-full text-xs font-semibold h-8 px-3"
            >
              <Key className="w-3.5 h-3.5 mr-1.5" />
              Security
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="bg-transparent text-white border-white/25 hover:bg-white/10 rounded-full text-xs font-semibold h-8 px-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-300 hover:text-white hover:bg-red-500/20 rounded-full text-xs h-8 px-3 border border-red-400/20"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Unsaved changes banner */}
        {hasUnsavedChanges && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-amber-900 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-sm">You have unsaved website content modifications.</span>
                <p className="text-xs text-amber-700">Click &quot;Save Changes to Live Site&quot; to publish them directly to your public homepage.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetContent}
                className="bg-white border-amber-300 text-amber-900 rounded-full text-xs h-9"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSaveContent}
                disabled={savingCms}
                className="bg-[#0B5FD9] hover:bg-[#084db3] text-white rounded-full text-xs font-bold h-9 px-4 shadow-sm"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {savingCms ? "Saving..." : "Save Changes to Live Site"}
              </Button>
            </div>
          </div>
        )}

        {/* Primary Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE7F7] pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("cms")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === "cms"
                  ? "bg-[#0B5FD9] text-white shadow-sm"
                  : "bg-white text-[#44546F] border border-[#DCE7F7] hover:bg-slate-100"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Content Management (CMS)</span>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === "inquiries"
                  ? "bg-[#0B5FD9] text-white shadow-sm"
                  : "bg-white text-[#44546F] border border-[#DCE7F7] hover:bg-slate-100"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbound Leads</span>
              <Badge variant="secondary" className="ml-1 text-[11px] px-2 py-0">
                {inquiries.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("consultations")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === "consultations"
                  ? "bg-[#0B5FD9] text-white shadow-sm"
                  : "bg-white text-[#44546F] border border-[#DCE7F7] hover:bg-slate-100"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Consultations</span>
              <Badge variant="secondary" className="ml-1 text-[11px] px-2 py-0">
                {consultations.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === "analytics"
                  ? "bg-[#0B5FD9] text-white shadow-sm"
                  : "bg-white text-[#44546F] border border-[#DCE7F7] hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Metrics</span>
            </button>
          </div>

          {activeTab === "cms" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetContent}
                disabled={savingCms}
                className="rounded-full text-xs font-semibold text-slate-700 hover:text-red-700 border-[#DCE7F7]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Defaults
              </Button>
              <Button
                size="sm"
                onClick={handleSaveContent}
                disabled={savingCms}
                className="bg-[#0B5FD9] hover:bg-[#084db3] text-white rounded-full text-xs font-bold px-4 shadow-sm"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {savingCms ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* ================= TAB 1: CONTENT MANAGEMENT (CMS) ================= */}
        {activeTab === "cms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CMS Sidebar Navigation */}
            <div className="lg:col-span-3 flex flex-col gap-2 bg-white p-3 rounded-2xl border border-[#DCE7F7] shadow-sm">
              <div className="px-3 py-2 text-xs font-bold tracking-wider text-[#44546F] uppercase">
                Website Sections
              </div>
              {[
                { id: "hero", label: "Hero & Headline", icon: Sparkles },
                { id: "services", label: "Services & Odoo Offer", icon: Layers },
                { id: "whyUs", label: "Why ScaleUp (3 Pillars)", icon: ShieldCheck },
                { id: "process", label: "5-Step Process", icon: CheckCircle },
                { id: "clients", label: "Client Segments", icon: Building },
                { id: "contact", label: "Contact & Company Info", icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = cmsSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCmsSection(item.id as any)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-left transition-all ${
                      isSelected
                        ? "bg-[#0B5FD9] text-white shadow-sm"
                        : "text-[#0B1B4D] hover:bg-[#F3F8FF]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CMS Form Editor Area */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              {/* SECTION: HERO */}
              {cmsSection === "hero" && (
                <Card className="bg-white border-[#DCE7F7] shadow-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Hero & Headline Section</CardTitle>
                    <CardDescription>
                      Edit the primary banner text, value proposition, and call-to-action buttons.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0B1B4D]">Top Tagline Pill</label>
                      <Input
                        value={content.hero.tagline}
                        onChange={(e) => updateCmsField("hero", "tagline", e.target.value)}
                        placeholder="ODOO ERP · SOFTWARE · INFRASTRUCTURE"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0B1B4D]">Main Headline</label>
                      <Input
                        value={content.hero.title}
                        onChange={(e) => updateCmsField("hero", "title", e.target.value)}
                        placeholder="Scaling businesses through smart software and digital innovation."
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0B1B4D]">
                        Highlighted Words in Headline (Colored Blue)
                      </label>
                      <Input
                        value={content.hero.highlightedText}
                        onChange={(e) => updateCmsField("hero", "highlightedText", e.target.value)}
                        placeholder="smart software"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#0B1B4D]">Subtitle / Lead Description</label>
                      <Textarea
                        rows={3}
                        value={content.hero.description}
                        onChange={(e) => updateCmsField("hero", "description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Primary CTA Button Text</label>
                        <Input
                          value={content.hero.ctaPrimary}
                          onChange={(e) => updateCmsField("hero", "ctaPrimary", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Secondary CTA Button Text</label>
                        <Input
                          value={content.hero.ctaSecondary}
                          onChange={(e) => updateCmsField("hero", "ctaSecondary", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Bottom Ethiopia Badge Text</label>
                        <Input
                          value={content.hero.badgeText}
                          onChange={(e) => updateCmsField("hero", "badgeText", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Chart Graphic Badges</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={content.hero.badgeOdoo}
                            onChange={(e) => updateCmsField("hero", "badgeOdoo", e.target.value)}
                            placeholder="Odoo ERP"
                          />
                          <Input
                            value={content.hero.badgeCloud}
                            onChange={(e) => updateCmsField("hero", "badgeCloud", e.target.value)}
                            placeholder="Cloud & infrastructure"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SECTION: SERVICES */}
              {cmsSection === "services" && (
                <div className="flex flex-col gap-6">
                  <Card className="bg-white border-[#DCE7F7] shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <CardTitle className="text-xl">Services Header</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Section Category Tag</label>
                          <Input
                            value={content.services.sectionTag}
                            onChange={(e) => updateCmsField("services", "sectionTag", e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Section Title</label>
                          <Input
                            value={content.services.sectionTitle}
                            onChange={(e) => updateCmsField("services", "sectionTitle", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Subtitle</label>
                        <Textarea
                          rows={2}
                          value={content.services.sectionDesc}
                          onChange={(e) => updateCmsField("services", "sectionDesc", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Featured Odoo Card */}
                  <Card className="bg-white border-[#DCE7F7] shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <CardTitle className="text-xl">Featured Offer: Odoo ERP</CardTitle>
                      <CardDescription>
                        Customization for the highlighted dark navy offer card.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Badge Label</label>
                          <Input
                            value={content.services.featured.badge}
                            onChange={(e) => {
                              const updated = { ...content.services.featured, badge: e.target.value };
                              updateCmsField("services", "featured", updated);
                            }}
                          />
                        </div>
                        <div className="sm:col-span-2 flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Card Title</label>
                          <Input
                            value={content.services.featured.title}
                            onChange={(e) => {
                              const updated = { ...content.services.featured, title: e.target.value };
                              updateCmsField("services", "featured", updated);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Card Description</label>
                        <Textarea
                          rows={3}
                          value={content.services.featured.description}
                          onChange={(e) => {
                            const updated = { ...content.services.featured, description: e.target.value };
                            updateCmsField("services", "featured", updated);
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#0B1B4D]">5 Deliverable Checklist Items</label>
                        {content.services.featured.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 text-xs text-slate-400 font-bold">{idx + 1}.</span>
                            <Input
                              value={feat}
                              onChange={(e) => {
                                const newFeatures = [...content.services.featured.features];
                                newFeatures[idx] = e.target.value;
                                const updated = { ...content.services.featured, features: newFeatures };
                                updateCmsField("services", "featured", updated);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4 Secondary Service Cards */}
                  <Card className="bg-white border-[#DCE7F7] shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <CardTitle className="text-xl">Secondary Service Cards</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {content.services.items.map((svc, idx) => (
                        <div key={svc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Service #{idx + 1} Title</label>
                          <Input
                            value={svc.title}
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              updateCmsField("services", "items", newItems);
                            }}
                          />
                          <label className="text-xs font-bold text-[#0B1B4D] mt-1">Description</label>
                          <Textarea
                            rows={3}
                            value={svc.description}
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              updateCmsField("services", "items", newItems);
                            }}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* SECTION: WHY SCALEUP */}
              {cmsSection === "whyUs" && (
                <Card className="bg-white border-[#DCE7F7] shadow-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Why ScaleUp (3 Pillars)</CardTitle>
                    <CardDescription>
                      Edit the three core value propositions that differentiate ScaleUp.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Category Tag</label>
                        <Input
                          value={content.whyUs.sectionTag}
                          onChange={(e) => updateCmsField("whyUs", "sectionTag", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Title</label>
                        <Input
                          value={content.whyUs.sectionTitle}
                          onChange={(e) => updateCmsField("whyUs", "sectionTitle", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {content.whyUs.items.map((pillar, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-[#1E88FF]">{pillar.number}</span>
                            <span className="text-xs text-slate-400 font-semibold">Pillar {idx + 1}</span>
                          </div>
                          <Input
                            value={pillar.title}
                            onChange={(e) => {
                              const newItems = [...content.whyUs.items];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              updateCmsField("whyUs", "items", newItems);
                            }}
                            placeholder="Pillar title"
                          />
                          <Textarea
                            rows={4}
                            value={pillar.description}
                            onChange={(e) => {
                              const newItems = [...content.whyUs.items];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              updateCmsField("whyUs", "items", newItems);
                            }}
                            placeholder="Description"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SECTION: PROCESS */}
              {cmsSection === "process" && (
                <Card className="bg-white border-[#DCE7F7] shadow-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">5-Step Delivery Process</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Category Tag</label>
                        <Input
                          value={content.process.sectionTag}
                          onChange={(e) => updateCmsField("process", "sectionTag", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Title</label>
                        <Input
                          value={content.process.sectionTitle}
                          onChange={(e) => updateCmsField("process", "sectionTitle", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                      {content.process.items.map((step, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-2">
                            <span className="text-xs font-bold text-[#0B5FD9] tracking-wider uppercase block">
                              {step.step}
                            </span>
                          </div>
                          <div className="sm:col-span-3">
                            <Input
                              value={step.title}
                              onChange={(e) => {
                                const newItems = [...content.process.items];
                                newItems[idx] = { ...newItems[idx], title: e.target.value };
                                updateCmsField("process", "items", newItems);
                              }}
                              placeholder="Step title"
                            />
                          </div>
                          <div className="sm:col-span-7">
                            <Input
                              value={step.description}
                              onChange={(e) => {
                                const newItems = [...content.process.items];
                                newItems[idx] = { ...newItems[idx], description: e.target.value };
                                updateCmsField("process", "items", newItems);
                              }}
                              placeholder="Step details"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SECTION: CLIENTS */}
              {cmsSection === "clients" && (
                <Card className="bg-white border-[#DCE7F7] shadow-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Target Client Segments</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Category Tag</label>
                        <Input
                          value={content.clients.sectionTag}
                          onChange={(e) => updateCmsField("clients", "sectionTag", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Section Title</label>
                        <Input
                          value={content.clients.sectionTitle}
                          onChange={(e) => updateCmsField("clients", "sectionTitle", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {content.clients.items.map((seg, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
                          <label className="text-xs font-bold text-[#0B1B4D]">Segment {idx + 1} Title</label>
                          <Input
                            value={seg.title}
                            onChange={(e) => {
                              const newItems = [...content.clients.items];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              updateCmsField("clients", "items", newItems);
                            }}
                          />
                          <label className="text-xs font-bold text-[#0B1B4D]">Tag / Audience Label</label>
                          <Input
                            value={seg.tag}
                            onChange={(e) => {
                              const newItems = [...content.clients.items];
                              newItems[idx] = { ...newItems[idx], tag: e.target.value };
                              updateCmsField("clients", "items", newItems);
                            }}
                          />
                          <label className="text-xs font-bold text-[#0B1B4D]">Description</label>
                          <Textarea
                            rows={3}
                            value={seg.description}
                            onChange={(e) => {
                              const newItems = [...content.clients.items];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              updateCmsField("clients", "items", newItems);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SECTION: CONTACT */}
              {cmsSection === "contact" && (
                <Card className="bg-white border-[#DCE7F7] shadow-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Contact & Company Coordinates</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Contact Section Heading</label>
                        <Input
                          value={content.contact.title}
                          onChange={(e) => updateCmsField("contact", "title", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Contact Section Subtitle</label>
                        <Input
                          value={content.contact.subtitle}
                          onChange={(e) => updateCmsField("contact", "subtitle", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Support Email</label>
                        <Input
                          value={content.contact.email}
                          onChange={(e) => updateCmsField("contact", "email", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Phone Number</label>
                        <Input
                          value={content.contact.phone}
                          onChange={(e) => updateCmsField("contact", "phone", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0B1B4D]">Headquarters / Office</label>
                        <Input
                          value={content.contact.office}
                          onChange={(e) => updateCmsField("contact", "office", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-[#F3F8FF] flex flex-col gap-3">
                      <label className="text-xs font-bold text-[#0B1B4D]">Guarantee / Assurance Callout</label>
                      <Input
                        value={content.contact.guaranteeTitle}
                        onChange={(e) => updateCmsField("contact", "guaranteeTitle", e.target.value)}
                        placeholder="ScaleUp Tech Guarantee:"
                      />
                      <Textarea
                        rows={2}
                        value={content.contact.guaranteeText}
                        onChange={(e) => updateCmsField("contact", "guaranteeText", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: INBOUND LEADS ================= */}
        {activeTab === "inquiries" && (
          <div className="flex flex-col gap-6">
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportInquiriesToCSV}
                  className="rounded-xl text-xs font-semibold h-10"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </Button>
              </div>
            </div>

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
                        <span className="text-lg font-bold text-[#0B1B4D]">{inq.name}</span>
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

        {/* ================= TAB 3: CONSULTATIONS ================= */}
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
                      <span>
                        Status: <strong className="text-emerald-600 uppercase">{cons.status}</strong>
                      </span>
                      <span className="text-[11px]">Booked on {new Date(cons.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: ANALYTICS & OVERVIEW ================= */}
        {activeTab === "analytics" && stats && (
          <div className="flex flex-col gap-6">
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

            {/* Demand by service */}
            <Card className="bg-white border-[#DCE7F7] p-6 shadow-sm">
              <CardTitle className="text-lg mb-4">Inquiry Demand by Technical Line</CardTitle>
              <div className="flex flex-col gap-3">
                {[
                  { name: "ERP (Odoo)", count: stats.byService?.odoo || 0, color: "bg-[#0B5FD9]" },
                  { name: "Web Applications", count: stats.byService?.web || 0, color: "bg-[#1E88FF]" },
                  { name: "IT Consulting", count: stats.byService?.consulting || 0, color: "bg-indigo-600" },
                  { name: "Mobile Applications", count: stats.byService?.mobile || 0, color: "bg-teal-500" },
                  { name: "Networking & Infrastructure", count: stats.byService?.infrastructure || 0, color: "bg-purple-600" },
                ].map((item, idx) => {
                  const percentage = Math.round((item.count / (stats.totalInquiries || 1)) * 100);
                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold text-[#0B1B4D]">
                        <span>{item.name}</span>
                        <span>{item.count} inquiries ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0B1B4D]">
              <Key className="w-5 h-5 text-[#0B5FD9]" />
              Change Administrator Password
            </DialogTitle>
            <DialogDescription className="text-xs text-[#44546F]">
              Update your password credentials stored securely in Neon PostgreSQL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D]">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D]">New Password (min 8 characters)</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new strong password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0B1B4D]">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={changingPassword}
                className="bg-[#0B5FD9] hover:bg-[#084db3] text-white text-xs font-semibold"
              >
                {changingPassword ? "Updating Password..." : "Save New Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
