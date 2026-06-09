import type { Metadata } from "next";
import { ReportSheet, Signatories, Field } from "@/components/reports/report-sheet";
import { transcript, institution } from "@/lib/reports";

export const metadata: Metadata = { title: "Transcript of Records" };

export default function TranscriptPage() {
  const { student, terms } = transcript;

  const allSubjects = terms.flatMap((t) => t.subjects);
  const totalUnits = allSubjects.reduce((s, c) => s + c.units, 0);
  const gwa =
    allSubjects.reduce((s, c) => s + parseFloat(c.grade) * c.units, 0) / totalUnits;

  return (
    <ReportSheet title="Official Transcript of Records" formCode="TOR">
      {/* Learner info */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
        <Field label="Name of Student" value={student.name} className="col-span-2 sm:col-span-2" />
        <Field label="Student No." value={student.studentNo} />
        <Field label="Program" value={student.program} className="col-span-2 sm:col-span-2" />
        <Field label="Sex" value={student.sex} />
        <Field label="Date of Birth" value={student.dateOfBirth} />
        <Field label="Place of Birth" value={student.placeOfBirth} />
        <Field label="Date Admitted" value={student.dateAdmitted} />
        <Field label="Entrance Credentials" value={student.entranceCredentials} className="col-span-2" />
        <Field label="Date Graduated" value={student.dateGraduated} />
      </section>

      {/* Academic record */}
      <section className="mt-8">
        <h2 className="mb-3 border-b-2 border-ink-800 pb-1 font-display text-sm font-bold uppercase tracking-wide">
          Scholastic Record
        </h2>

        <div className="space-y-6">
          {terms.map((term) => {
            const termUnits = term.subjects.reduce((s, c) => s + c.units, 0);
            return (
              <div key={`${term.schoolYear}-${term.semester}`}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {term.semester}, S.Y. {term.schoolYear}
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
        <span className="font-semibold text-ink-700">{student.name}</span> as appearing in
        the files of this institution. Not valid without the school seal and the signature
        of the Registrar. Any erasure or alteration renders this document void.
      </p>

      <Signatories
        items={[
          { name: "Maria Teresa V. Reyes", role: "Evaluated by — Records Officer" },
          { name: institution.registrar, role: "Certified by — University Registrar" },
        ]}
      />
    </ReportSheet>
  );
}
