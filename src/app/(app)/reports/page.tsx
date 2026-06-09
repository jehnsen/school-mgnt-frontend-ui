import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ScrollText, BookMarked, ArrowRight, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Reports & Documents" };

const reports = [
  {
    href: "/reports/transcript",
    icon: ScrollText,
    title: "Transcript of Records",
    code: "TOR",
    desc: "Official collegiate transcript with subjects, units, ratings and general weighted average.",
    tone: "bg-brand-50 text-brand-600",
    tag: "Collegiate",
  },
  {
    href: "/reports/form-138",
    icon: FileText,
    title: "Report Card",
    code: "DepEd SF9 (Form 138)",
    desc: "Learner's Progress Report Card — quarterly grades, core values and attendance record.",
    tone: "bg-accent-500/10 text-accent-600",
    tag: "DepEd K-12",
  },
  {
    href: "/reports/form-137",
    icon: BookMarked,
    title: "Permanent Academic Record",
    code: "DepEd SF10 (Form 137)",
    desc: "Learner's permanent scholastic record across grade levels with action taken and eligibility.",
    tone: "bg-info-50 text-info-600",
    tag: "DepEd K-12",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Documents"
        description="Generate official, print-ready academic documents and DepEd-compliant school forms."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Link key={r.href} href={r.href}>
            <Card className="group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${r.tone}`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <Badge tone="neutral">{r.tag}</Badge>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                {r.title}
              </h3>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-brand-600">
                {r.code}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{r.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-400">
                  <Printer className="h-3.5 w-3.5" />
                  Print / PDF ready
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                  Generate
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-dashed bg-ink-50/50 p-5">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-700">Note:</span> School Forms follow
          DepEd Order formats — SF9 (formerly Form 138) and SF10 (formerly Form 137).
          Each document opens a print-ready A4 layout; use{" "}
          <span className="font-medium text-ink-700">Print</span> or{" "}
          <span className="font-medium text-ink-700">Save as PDF</span> to export.
        </p>
      </Card>
    </div>
  );
}
