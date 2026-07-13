"use client";

import { useState } from "react";
import { ScrollText, Search } from "lucide-react";
import { ReportSheet, Signatories, Field } from "@/components/reports/report-sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery } from "@/hooks/use-query";
import { reportsApi } from "@/lib/api/endpoints";
import { institution } from "@/lib/reports";
import type { ID } from "@/lib/api/types";

export default function TranscriptPage() {
  const [studentId, setStudentId] = useState("");
  const [activeId, setActiveId] = useState<ID | null>(null);

  const query = useQuery(
    () => reportsApi.transcript(activeId as ID),
    [activeId],
    { enabled: activeId != null },
  );
  const report = query.data?.data;

  const allSubjects = report?.terms.flatMap((t) => t.subjects) ?? [];
  const totalUnits = allSubjects.reduce((s, c) => s + c.units, 0);
  const gwa =
    totalUnits > 0
      ? allSubjects.reduce((s, c) => s + parseFloat(c.grade) * c.units, 0) / totalUnits
      : 0;

  return (
    <ReportSheet title="Official Transcript of Records" formCode="TOR">
      <div className="no-print mb-6">
        <Card>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-ink-400">
                Student ID
              </p>
              <div className="flex gap-2">
                <Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  type="number"
                  placeholder="Enter student ID"
                />
                <Button
                  onClick={() => setActiveId(studentId ? Number(studentId) : null)}
                  disabled={!studentId}
                >
                  <Search className="h-4 w-4" />
                  Look up
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {activeId == null ? (
        <EmptyState
          icon={ScrollText}
          title="Look up a transcript"
          description="Enter a student ID to generate their Transcript of Records."
        />
      ) : query.loading ? (
        <LoadingState rows={4} />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : !report ? (
        <EmptyState icon={ScrollText} title="No transcript found" description="This student has no scholastic record on file." />
      ) : (
        <>
          {/* Learner info */}
          <section className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            <Field label="Name of Student" value={report.student.name} className="col-span-2 sm:col-span-2" />
            <Field label="Student No." value={report.student.student_no ?? "—"} />
            <Field label="Program" value={report.student.program ?? "—"} className="col-span-2 sm:col-span-2" />
            <Field label="Sex" value={report.student.sex ?? "—"} />
            <Field label="Date of Birth" value={report.student.date_of_birth ?? "—"} />
            <Field label="Place of Birth" value={report.student.place_of_birth ?? "—"} />
            <Field label="Date Admitted" value={report.student.date_admitted ?? "—"} />
            <Field label="Entrance Credentials" value={report.student.entrance_credentials ?? "—"} className="col-span-2" />
            <Field label="Date Graduated" value={report.student.date_graduated ?? "—"} />
          </section>

          {/* Academic record */}
          <section className="mt-8">
            <h2 className="mb-3 border-b-2 border-ink-800 pb-1 font-display text-sm font-bold uppercase tracking-wide">
              Scholastic Record
            </h2>

            <div className="space-y-6">
              {report.terms.map((term) => {
                const termUnits = term.subjects.reduce((s, c) => s + c.units, 0);
                return (
                  <div key={`${term.school_year}-${term.semester}`}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                      {term.semester}, S.Y. {term.school_year}
                    </p>
                    <table className="w-full border-collapse text-[12px]">
                      <thead>
                        <tr className="border-y border-ink-300 bg-ink-50 text-left text-[10px] uppercase tracking-wide text-ink-500">
                          <th className="px-2 py-1.5 font-semibold">Code</th>
                          <th className="px-2 py-1.5 font-semibold">Subject Title</th>
                          <th className="px-2 py-1.5 text-center font-semibold">Units</th>
                          <th className="px-2 py-1.5 text-center font-semibold">Final Grade</th>
                          <th className="px-2 py-1.5 text-center font-semibold">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {term.subjects.map((c) => (
                          <tr key={c.code} className="border-b border-ink-100">
                            <td className="px-2 py-1.5 font-medium">{c.code}</td>
                            <td className="px-2 py-1.5">{c.title}</td>
                            <td className="px-2 py-1.5 text-center">{c.units.toFixed(1)}</td>
                            <td className="px-2 py-1.5 text-center font-semibold">{c.grade}</td>
                            <td className="px-2 py-1.5 text-center">{c.credit.toFixed(1)}</td>
                          </tr>
                        ))}
                        <tr className="bg-ink-50/60 text-[11px] font-semibold">
                          <td className="px-2 py-1.5" colSpan={2}>
                            Total units this term
                          </td>
                          <td className="px-2 py-1.5 text-center">{termUnits.toFixed(1)}</td>
                          <td className="px-2 py-1.5" colSpan={2} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Summary */}
          <section className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-ink-200 bg-ink-50 px-5 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-ink-400">Total Units Earned</p>
              <p className="font-display text-xl font-bold">{totalUnits.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-ink-400">General Weighted Average</p>
              <p className="font-display text-xl font-bold text-brand-700">{gwa.toFixed(3)}</p>
            </div>
            <div className="text-[11px] text-ink-500">
              <p className="font-semibold">Grading System</p>
              <p>1.00 (Excellent) – 3.00 (Passing) · 5.00 (Failed)</p>
            </div>
          </section>

          {/* Remarks */}
          <p className="mt-6 text-[11px] leading-relaxed text-ink-500">
            This is to certify that the above is a true record of{" "}
            <span className="font-semibold text-ink-700">{report.student.name}</span> as appearing in
            the files of this institution. Not valid without the school seal and the signature
            of the Registrar. Any erasure or alteration renders this document void.
          </p>

          <Signatories
            items={[
              { name: "Maria Teresa V. Reyes", role: "Evaluated by — Records Officer" },
              { name: institution.registrar, role: "Certified by — University Registrar" },
            ]}
          />
        </>
      )}
    </ReportSheet>
  );
}
