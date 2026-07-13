"use client";

import { useState } from "react";
import { BookMarked, Search } from "lucide-react";
import { ReportSheet, Signatories, Field } from "@/components/reports/report-sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery } from "@/hooks/use-query";
import { reportsApi } from "@/lib/api/endpoints";
import { institution, avg } from "@/lib/reports";
import type { ID } from "@/lib/api/types";

const QUARTERS = ["1st", "2nd", "3rd", "4th"] as const;

export default function PermanentRecordPage() {
  const [studentId, setStudentId] = useState("");
  const [activeId, setActiveId] = useState<ID | null>(null);

  const query = useQuery(
    () => reportsApi.form137(activeId as ID),
    [activeId],
    { enabled: activeId != null },
  );
  const report = query.data?.data;

  return (
    <ReportSheet
      title="Learner's Permanent Academic Record"
      formCode="DepEd School Form 10 (SF10) — formerly Form 137"
    >
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
          icon={BookMarked}
          title="Look up a permanent record"
          description="Enter a student ID to generate their SF10."
        />
      ) : query.loading ? (
        <LoadingState rows={4} />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : !report ? (
        <EmptyState icon={BookMarked} title="No record found" description="This student has no permanent record on file." />
      ) : (
        <>
          {/* Learner profile */}
          <section className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            <Field label="Last Name, First Name, Middle Name" value={report.learner.name} className="col-span-2 sm:col-span-2" />
            <Field label="LRN" value={report.learner.lrn ?? "—"} />
            <Field label="Sex" value={report.learner.sex ?? "—"} />
            <Field label="Date of Birth" value={report.learner.date_of_birth ?? "—"} />
            <Field label="Mother Tongue" value={report.learner.mother_tongue ?? "—"} />
            <Field label="Place of Birth" value={report.learner.place_of_birth ?? "—"} className="col-span-2" />
            <Field label="Parent / Guardian" value={report.learner.parent_guardian ?? "—"} className="col-span-2 sm:col-span-2" />
          </section>

          {/* Eligibility */}
          {report.eligibility && (
            <section className="mt-6">
              <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
                Eligibility for Admission / Completion
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg border border-ink-200 bg-ink-50 p-4 sm:grid-cols-4">
                <Field label="Type" value={report.eligibility.type ?? "—"} className="col-span-2" />
                <Field label="School" value={report.eligibility.school ?? institution.name} />
                <Field label="School ID" value={report.eligibility.school_id ?? institution.schoolId} />
                <Field label="School Year" value={report.eligibility.school_year ?? "—"} />
                <Field label="Grade Completed" value={report.eligibility.grade_completed ?? "—"} />
              </div>
            </section>
          )}

          {/* Scholastic records per grade level */}
          <section className="mt-7">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">
              Scholastic Record
            </h2>

            <div className="space-y-6">
              {report.records.map((rec) => {
                const finals = rec.areas.map((a) => a.final ?? avg(a.quarters.filter((q): q is number => q != null)));
                const generalAverage = avg(finals);
                return (
                  <div key={`${rec.grade_level}-${rec.school_year}`} className="rounded-lg border border-ink-200 p-4">
                    {/* Grade header */}
                    <div className="mb-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                      <Field label="School" value={institution.name} className="col-span-2" />
                      <Field label="Grade Level" value={rec.grade_level} />
                      <Field label="School Year" value={rec.school_year} />
                      <Field label="Section" value={rec.section ?? "—"} />
                      <Field label="Adviser" value={rec.adviser ?? "—"} className="col-span-2 sm:col-span-3" />
                    </div>

                    <table className="w-full border-collapse text-[12px]">
                      <thead>
                        <tr className="border border-ink-300 bg-ink-50 text-[10px] uppercase tracking-wide text-ink-600">
                          <th className="border border-ink-300 px-2 py-1.5 text-left font-semibold">
                            Learning Areas
                          </th>
                          {QUARTERS.map((q) => (
                            <th key={q} className="border border-ink-300 px-1 py-1.5 text-center font-semibold">
                              {q}
                            </th>
                          ))}
                          <th className="border border-ink-300 px-1 py-1.5 text-center font-semibold">
                            Final
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rec.areas.map((a, i) => (
                          <tr key={a.area} className="border border-ink-200">
                            <td className="border border-ink-200 px-2 py-1.5 font-medium">{a.area}</td>
                            {a.quarters.map((g, qi) => (
                              <td key={qi} className="border border-ink-200 px-1 py-1.5 text-center">
                                {g ?? "—"}
                              </td>
                            ))}
                            <td className="border border-ink-200 px-1 py-1.5 text-center font-bold">
                              {finals[i]}
                            </td>
                          </tr>
                        ))}
                        <tr className="border border-ink-300 bg-ink-50 font-bold">
                          <td className="border border-ink-300 px-2 py-1.5 text-right" colSpan={5}>
                            General Average
                          </td>
                          <td className="border border-ink-300 px-1 py-1.5 text-center text-brand-700">
                            {generalAverage}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mt-2 text-[11px]">
                      <span className="font-semibold uppercase tracking-wide text-ink-500">
                        Action Taken:{" "}
                      </span>
                      <span className="font-semibold text-ink-800">{rec.action_taken ?? "—"}</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10px] text-ink-500 sm:grid-cols-3">
              <span>90–100 · Outstanding</span>
              <span>85–89 · Very Satisfactory</span>
              <span>80–84 · Satisfactory</span>
              <span>75–79 · Fairly Satisfactory</span>
              <span>Below 75 · Did Not Meet Expectations</span>
              <span className="font-semibold">Passing Grade: 75</span>
            </div>
          </section>

          {/* Certification */}
          <p className="mt-6 text-[11px] leading-relaxed text-ink-500">
            I certify that this is a true copy of the permanent record of the learner named above.
            This record is not valid without the official seal of the school and the signature of
            the School Head / Authorized Representative.
          </p>

          <Signatories
            items={[
              { name: institution.registrar, role: "Prepared by — School Registrar" },
              { name: institution.principal, role: "Certified Correct — School Principal" },
            ]}
          />
        </>
      )}
    </ReportSheet>
  );
}
