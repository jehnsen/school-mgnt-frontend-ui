import type { Metadata } from "next";
import { Fragment } from "react";
import { ReportSheet, Signatories, Field } from "@/components/reports/report-sheet";
import { reportCard, avg, institution } from "@/lib/reports";

export const metadata: Metadata = { title: "Report Card · DepEd SF9" };

const QUARTERS = ["1st", "2nd", "3rd", "4th"] as const;

export default function ReportCardPage() {
  const { learner, learningAreas, coreValues, attendance } = reportCard;

  // Final rating per area = average of 4 quarters
  const finals = learningAreas.map((a) => avg(a.q));
  const generalAverage = avg(finals);
  const remarks = generalAverage >= 75 ? "PASSED" : "FAILED";

  const totalDays = attendance.reduce((s, m) => s + m.days, 0);
  const totalPresent = attendance.reduce((s, m) => s + m.present, 0);
  const totalAbsent = attendance.reduce((s, m) => s + m.absent, 0);

  return (
    <ReportSheet
      title="Report on Learning Progress and Achievement"
      formCode="DepEd School Form 9 (SF9) — formerly Form 138"
    >
      {/* Learner info */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
        <Field label="Name of Learner" value={learner.name} className="col-span-2" />
        <Field label="LRN" value={learner.lrn} />
        <Field label="Sex" value={learner.sex} />
        <Field label="Grade & Section" value={`${learner.grade} – ${learner.section}`} />
        <Field label="School Year" value={learner.schoolYear} />
        <Field label="Adviser" value={learner.adviser} className="col-span-2" />
      </section>

      {/* Grades table */}
      <section className="mt-7">
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
          Learner&apos;s Progress Report
        </h2>
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
              <th className="border border-ink-300 px-2 py-1.5 text-center font-semibold">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {learningAreas.map((area, i) => {
              const final = finals[i];
              return (
                <Fragment key={area.area}>
                  <tr className="border border-ink-200">
                    <td className="border border-ink-200 px-2 py-1.5 font-medium">
                      {area.area}
                    </td>
                    {area.q.map((g, qi) => (
                      <td key={qi} className="border border-ink-200 px-1 py-1.5 text-center">
                        {g}
                      </td>
                    ))}
                    <td className="border border-ink-200 px-1 py-1.5 text-center font-bold">
                      {final}
                    </td>
                    <td className="border border-ink-200 px-2 py-1.5 text-center">
                      {final >= 75 ? "Passed" : "Failed"}
                    </td>
                  </tr>
                  {/* MAPEH components */}
                  {area.components?.map((comp) => (
                    <tr key={comp.name} className="border border-ink-200 text-ink-500">
                      <td className="border border-ink-200 px-2 py-1 pl-6 italic">
                        {comp.name}
                      </td>
                      {comp.q.map((g, qi) => (
                        <td key={qi} className="border border-ink-200 px-1 py-1 text-center">
                          {g}
                        </td>
                      ))}
                      <td className="border border-ink-200 px-1 py-1 text-center">
                        {avg(comp.q)}
                      </td>
                      <td className="border border-ink-200 px-2 py-1 text-center">—</td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
            <tr className="border border-ink-300 bg-ink-50 font-bold">
              <td className="border border-ink-300 px-2 py-1.5 text-right" colSpan={5}>
                General Average
              </td>
              <td className="border border-ink-300 px-1 py-1.5 text-center text-brand-700">
                {generalAverage}
              </td>
              <td className="border border-ink-300 px-2 py-1.5 text-center">{remarks}</td>
            </tr>
          </tbody>
        </table>

        {/* Descriptor legend */}
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10px] text-ink-500 sm:grid-cols-3">
          <span>90–100 · Outstanding</span>
          <span>85–89 · Very Satisfactory</span>
          <span>80–84 · Satisfactory</span>
          <span>75–79 · Fairly Satisfactory</span>
          <span>Below 75 · Did Not Meet Expectations</span>
          <span className="font-semibold">Passing Grade: 75</span>
        </div>
      </section>

      {/* Core values + attendance side by side */}
      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        {/* Core values */}
        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
            Report on Learner&apos;s Observed Values
          </h2>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border border-ink-300 bg-ink-50 text-[9px] uppercase text-ink-600">
                <th className="border border-ink-300 px-2 py-1 text-left font-semibold">
                  Core Values / Behavior Statements
                </th>
                {QUARTERS.map((q) => (
                  <th key={q} className="border border-ink-300 px-1 py-1 text-center font-semibold">
                    {q}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coreValues.map((cv) => (
                <tr key={cv.value} className="border border-ink-200 align-top">
                  <td className="border border-ink-200 px-2 py-1">
                    <p className="font-semibold text-ink-800">{cv.value}</p>
                    <ul className="mt-0.5 list-disc pl-4 text-ink-500">
                      {cv.statements.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  {cv.marks.map((m, mi) => (
                    <td key={mi} className="border border-ink-200 px-1 py-1 text-center font-medium">
                      {m}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1.5 text-[9px] text-ink-500">
            Marking: AO – Always Observed · SO – Sometimes Observed · RO – Rarely Observed ·
            NO – Not Observed
          </p>
        </div>

        {/* Attendance */}
        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
            Record of Attendance
          </h2>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border border-ink-300 bg-ink-50 text-[9px] uppercase text-ink-600">
                <th className="border border-ink-300 px-2 py-1 text-left font-semibold">Month</th>
                <th className="border border-ink-300 px-1 py-1 text-center font-semibold">
                  School Days
                </th>
                <th className="border border-ink-300 px-1 py-1 text-center font-semibold">
                  Present
                </th>
                <th className="border border-ink-300 px-1 py-1 text-center font-semibold">
                  Absent
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((m) => (
                <tr key={m.month} className="border border-ink-200">
                  <td className="border border-ink-200 px-2 py-1 font-medium">{m.month}</td>
                  <td className="border border-ink-200 px-1 py-1 text-center">{m.days}</td>
                  <td className="border border-ink-200 px-1 py-1 text-center">{m.present}</td>
                  <td className="border border-ink-200 px-1 py-1 text-center">{m.absent}</td>
                </tr>
              ))}
              <tr className="border border-ink-300 bg-ink-50 font-bold">
                <td className="border border-ink-300 px-2 py-1">Total</td>
                <td className="border border-ink-300 px-1 py-1 text-center">{totalDays}</td>
                <td className="border border-ink-300 px-1 py-1 text-center">{totalPresent}</td>
                <td className="border border-ink-300 px-1 py-1 text-center">{totalAbsent}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Signatories
        items={[
          { name: learner.adviser, role: "Class Adviser" },
          { name: institution.principal, role: "School Principal" },
        ]}
      />
    </ReportSheet>
  );
}
