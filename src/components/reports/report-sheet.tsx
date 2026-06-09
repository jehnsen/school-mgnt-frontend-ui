"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { institution } from "@/lib/reports";

/* Toolbar shown on screen (hidden when printing) + the A4 paper itself. */
export function ReportSheet({
  title,
  formCode,
  children,
}: {
  title: string;
  formCode?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to reports
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-ink-400 sm:inline">
            {formCode ? `${formCode} · ` : ""}Preview
          </span>
          <button
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            <Download className="h-4 w-4" />
            Save as PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Paper */}
      <div className="report-paper rounded-sm border border-ink-200 p-8 shadow-card sm:p-10 print:p-0">
        <ReportHeader title={title} formCode={formCode} />
        <div className="mt-6 text-ink-900">{children}</div>
      </div>
    </div>
  );
}

function ReportHeader({ title, formCode }: { title: string; formCode?: string }) {
  return (
    <header className="relative text-center">
      {formCode && (
        <span className="absolute right-0 top-0 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          {formCode}
        </span>
      )}
      <div className="flex items-center justify-center gap-4">
        {/* DepEd-style seal placeholder (left) */}
        <Seal label="DepEd" />
        <div className="leading-tight">
          <p className="text-[11px] font-medium text-ink-600">Republic of the Philippines</p>
          <p className="text-[12px] font-semibold tracking-wide text-ink-700">
            Department of Education
          </p>
          <p className="text-[10px] text-ink-500">
            {institution.region} · {institution.division}
          </p>
          <p className="mt-1 font-display text-lg font-bold tracking-tight text-ink-900">
            {institution.name}
          </p>
          <p className="text-[10px] text-ink-500">
            School ID: {institution.schoolId} · {institution.address}
          </p>
        </div>
        {/* School seal placeholder (right) */}
        <Seal label="A360" />
      </div>

      <div className="mx-auto mt-4 max-w-md border-t-2 border-ink-800 pt-2">
        <h1 className="font-display text-base font-bold uppercase tracking-wide text-ink-900">
          {title}
        </h1>
      </div>
    </header>
  );
}

function Seal({ label }: { label: string }) {
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink-300 text-center text-[9px] font-bold uppercase leading-tight text-ink-400">
      {label}
      <br />
      Seal
    </span>
  );
}

/* Reusable signatory block used at the bottom of every form. */
export function Signatories({
  items,
}: {
  items: { name: string; role: string }[];
}) {
  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2">
      {items.map((s) => (
        <div key={s.role} className="text-center">
          <p className="mb-1 font-display text-sm font-semibold text-ink-900">
            {s.name}
          </p>
          <div className="border-t border-ink-400" />
          <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-500">
            {s.role}
          </p>
        </div>
      ))}
    </div>
  );
}

/* Compact labeled field used in learner-info grids. */
export function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="border-b border-ink-200 pb-0.5 text-sm font-medium text-ink-900">
        {value}
      </p>
    </div>
  );
}
