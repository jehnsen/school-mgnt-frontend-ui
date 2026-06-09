import type { Metadata } from "next";
import { ReportSheet, Signatories, Field } from "@/components/reports/report-sheet";
import { permanentRecord, avg, institution } from "@/lib/reports";

export const metadata: Metadata = { title: "Permanent Record · DepEd SF10" };

const QUARTERS = ["1st", "2nd", "3rd", "4th"] as const;

export default function PermanentRecordPage() {
  const { learner, eligibility, records } = permanentRecord;

  return (
    <ReportSheet
      title="Learner's Permanent Academic Record"
      formCode="DepEd School Form 10 (SF10) — formerly Form 137"
    >
      {/* Learner profile */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
        <Field label="Last Name, First Name, Middle Name" value={learner.name} className="col-span-2 sm:col-span-2" />
        <Field label="LRN" value={learner.lrn} />
        <Field label="Sex" value={learner.sex} />
        <Field label="Date of Birth" value={learner.dateOfBirth} />
        <Field label="Mother Tongue" value={learner.motherTongue} />
        <Field label="Place of Birth" value={learner.placeOfBirth} className="col-span-2" />
        <Field label="Parent / Guardian" value={learner.parentGuardian} className="col-span-2 sm:col-span-2" />
      </section>

      {/* Eligibility */}
      <section className="mt-6">
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
          Eligibility for Admission / Completion
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg border border-ink-200 bg-ink-50 p-4 sm:grid-cols-4">
          <Field label="Type" value={eligibility.type} className="col-span-2" />
          <Field label="School" value={eligibility.school} />
          <Field label="School ID" value={eligibility.schoolId} />
          <Field label="School Year" value={eligibility.schoolYear} />
          <Field label="Grade Completed" value={eligibility.gradeCompleted} />
        </div>
      </section>

      {/* Scholastic records per grade level */}
      <section className="mt-7">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">
          Scholastic Record
        </h2>

        <div className="space-y-6">
          {records.map((rec) => {
            const finals = rec.areas.map((a) => avg(a.q));
            const generalAverage = avg(finals);
            return (
              <div key={rec.gradeLevel} className="rounded-lg border border-ink-200 p-4">
                {/* Grade header */}
                <div className="mb-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                  <Field label="School" value={institution.name} className="col-span-2" />
                  <Field label="Grade Level" value={rec.gradeLevel} />
                  <Field label="School Year" value={rec.schoolYear} />
                  <Field label="Section" value={rec.section} />
                  <Field label="Adviser" value={rec.adviser} className="col-span-2 sm:col-span-3" />
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
                        {a.q.map((g, qi) => (
                          <td key={qi} className="border border-ink-200 px-1 py-1.5 text-center">
                            {g}
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
                  <span className="font-semibold text-ink-800">{rec.actionTaken}</span>
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
    </ReportSheet>
  );
}
