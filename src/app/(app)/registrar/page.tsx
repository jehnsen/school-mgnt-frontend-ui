"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  PauseCircle,
  Inbox,
  FileCheck2,
  Archive,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { documentRequests, type DocStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusTone: Record<DocStatus, "success" | "info" | "warning" | "danger"> = {
  Released: "success",
  Processing: "info",
  Requested: "warning",
  "On Hold": "danger",
};

const filters: { label: string; value: DocStatus | "All" }[] = [
  { label: "All requests", value: "All" },
  { label: "Requested", value: "Requested" },
  { label: "Processing", value: "Processing" },
  { label: "On Hold", value: "On Hold" },
  { label: "Released", value: "Released" },
];

export default function RegistrarPage() {
  const [filter, setFilter] = useState<DocStatus | "All">("All");
  const [query, setQuery] = useState("");

  const rows = documentRequests.filter(
    (d) =>
      (filter === "All" || d.status === filter) &&
      (d.student.toLowerCase().includes(query.toLowerCase()) ||
        d.type.toLowerCase().includes(query.toLowerCase()) ||
        d.id.toLowerCase().includes(query.toLowerCase())),
  );

  const count = (s: DocStatus) => documentRequests.filter((d) => d.status === s).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registrar's Document Management"
        description="Manage academic records, transcripts, and official documents across the full request lifecycle."
      >
        <Button variant="outline" size="md">
          <Archive className="h-4 w-4" />
          Records archive
        </Button>
        <Button size="md">
          <Plus className="h-4 w-4" />
          New request
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Inbox, label: "New requests", value: count("Requested"), tone: "bg-warning-50 text-warning-600" },
          { icon: Clock, label: "Processing", value: count("Processing"), tone: "bg-info-50 text-info-600" },
          { icon: PauseCircle, label: "On hold", value: count("On Hold"), tone: "bg-danger-50 text-danger-600" },
          { icon: FileCheck2, label: "Released this month", value: count("Released") + 142, tone: "bg-success-50 text-success-600" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-ink-900">{s.value}</p>
              <p className="text-sm text-ink-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Document types quick grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Transcript of Records", href: "/reports/transcript" },
          { label: "Report Card · SF9 (Form 138)", href: "/reports/form-138" },
          { label: "Permanent Record · SF10 (Form 137)", href: "/reports/form-137" },
          { label: "Certificate of Enrollment", href: "/reports" },
        ].map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="group flex items-center gap-3 rounded-2xl border border-ink-200/70 bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-ink-800">{t.label}</span>
          </Link>
        ))}
      </div>

      {/* Request queue */}
      <Card>
        <CardHeader className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Request Queue</CardTitle>
            <CardDescription>Track and process document requests</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search requests…"
              className="h-9 w-full rounded-xl border border-ink-200 bg-ink-50 pl-10 pr-4 text-sm focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 px-5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filter === f.value
                    ? "bg-brand-600 text-white"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-2.5 font-medium">Request ID</th>
                  <th className="px-5 py-2.5 font-medium">Student</th>
                  <th className="px-5 py-2.5 font-medium">Document</th>
                  <th className="px-5 py-2.5 font-medium">Purpose</th>
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((d) => (
                  <tr key={d.id} className="hover:bg-ink-50/60">
                    <td className="px-5 py-3 font-mono text-xs text-ink-500">{d.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={d.student} size="sm" />
                        <span className="font-medium text-ink-900">{d.student}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-ink-800">{d.type}</p>
                      <p className="text-xs text-ink-400">{d.copies} copy(s)</p>
                    </td>
                    <td className="px-5 py-3 text-ink-600">{d.purpose}</td>
                    <td className="px-5 py-3 text-ink-500">{d.requested}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[d.status]} dot>{d.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {d.status === "Released" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Done
                        </span>
                      ) : (
                        <Button size="sm" variant="outline">
                          {d.status === "Requested" ? "Process" : d.status === "Processing" ? "Release" : "Review"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-ink-400">
                      No requests match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
