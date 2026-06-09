"use client";

import { useState } from "react";
import { BookOpenCheck, Send, Users, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { classesApi } from "@/lib/api/endpoints";
import type { Enrollment, GradingPeriod, ID, SchoolClass } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const PERIODS: { value: GradingPeriod; label: string }[] = [
  { value: "1st_quarter", label: "1st Quarter" },
  { value: "2nd_quarter", label: "2nd Quarter" },
  { value: "3rd_quarter", label: "3rd Quarter" },
  { value: "4th_quarter", label: "4th Quarter" },
];

function gradeTone(g: number | null) {
  if (g == null) return "neutral" as const;
  if (g >= 90) return "success" as const;
  if (g >= 85) return "brand" as const;
  if (g >= 75) return "info" as const;
  return "danger" as const;
}

export default function ClassesPage() {
  const classes = useQuery(() => classesApi.myClasses(), []);
  const [activeId, setActiveId] = useState<ID | null>(null);
  const [period, setPeriod] = useState<GradingPeriod>("1st_quarter");

  const classRows = (classes.data?.data ?? []) as SchoolClass[];
  const currentId = activeId ?? classRows[0]?.id ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes & Grading"
        description="Encode quarterly grades for your classes. The DepEd passing grade is 75."
      />

      {classes.loading ? (
        <LoadingState rows={3} />
      ) : classes.error ? (
        <ErrorState error={classes.error} onRetry={classes.refetch} />
      ) : classRows.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="No classes assigned" description="Classes assigned to you will appear here." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classRows.map((c) => {
              const active = currentId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    active ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200" : "border-ink-200 bg-white hover:border-ink-300",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn("font-semibold", active ? "text-brand-700" : "text-ink-900")}>
                      {c.subject?.name ?? `Subject #${c.subject_id}`}
                    </p>
                    <Badge tone="neutral">{c.subject?.code ?? "—"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-400">
                    {c.section?.name ?? `Section #${c.section_id}`}
                    {c.students_count != null ? ` · ${c.students_count} students` : ""}
                  </p>
                </button>
              );
            })}
          </div>

          {currentId != null && (
            <GradeSheet classId={currentId} period={period} onPeriod={setPeriod} />
          )}
        </>
      )}
    </div>
  );
}

function GradeSheet({
  classId,
  period,
  onPeriod,
}: {
  classId: ID;
  period: GradingPeriod;
  onPeriod: (p: GradingPeriod) => void;
}) {
  const roster = useQuery(() => classesApi.students(classId), [classId]);
  const submit = useMutation(
    (grades: { enrollment_id: ID; grade: number }[]) =>
      classesApi.submitGrades(classId, period, grades),
  );
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const students = (roster.data?.data ?? []) as Enrollment[];

  function setGrade(enrollmentId: ID, value: string) {
    setSaved(false);
    setGrades((g) => ({ ...g, [String(enrollmentId)]: value }));
  }

  async function handleSubmit() {
    const payload = students
      .map((e) => ({ enrollment_id: e.id, grade: Number(grades[String(e.id)]) }))
      .filter((g) => !Number.isNaN(g.grade));
    if (payload.length === 0) return;
    await submit.mutate(payload).then(() => setSaved(true)).catch(() => {});
  }

  return (
    <Card>
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-600" />
            Class Roster & Grades
          </CardTitle>
          <CardDescription>Enter a grade (0–100) for each learner</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onChange={(e) => onPeriod(e.target.value as GradingPeriod)} className="w-40">
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
          <Button onClick={handleSubmit} disabled={submit.loading}>
            {submit.loading ? <Save className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
            {submit.loading ? "Posting…" : "Post grades"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {roster.loading ? (
          <div className="p-5"><LoadingState rows={6} /></div>
        ) : roster.error ? (
          <ErrorState error={roster.error} onRetry={roster.refetch} className="m-5" />
        ) : students.length === 0 ? (
          <EmptyState title="No students enrolled" className="m-5" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">Student</th>
                    <th className="px-5 py-2.5 text-center font-medium">Grade</th>
                    <th className="px-5 py-2.5 text-center font-medium">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {students.map((e) => {
                    const raw = grades[String(e.id)];
                    const g = raw === undefined || raw === "" ? null : Number(raw);
                    const name =
                      e.student?.name ||
                      `${e.student?.first_name ?? ""} ${e.student?.last_name ?? ""}`.trim() ||
                      `Student #${e.student_id}`;
                    return (
                      <tr key={e.id} className="hover:bg-ink-50/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={name} size="sm" />
                            <span className="font-medium text-ink-900">{name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={raw ?? ""}
                            onChange={(ev) => setGrade(e.id, ev.target.value)}
                            className="h-9 w-20 rounded-lg border border-ink-200 bg-white text-center text-sm font-medium focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          />
                        </td>
                        <td className="px-5 py-3 text-center">
                          {g == null ? (
                            <span className="text-xs text-ink-300">—</span>
                          ) : (
                            <Badge tone={gradeTone(g)}>{g >= 75 ? "Passed" : "Failed"}</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm">
              <span className="text-ink-500">{students.length} learners</span>
              {saved && <span className="font-medium text-success-600">Grades posted ✓</span>}
              {submit.error && <span className="font-medium text-danger-600">{submit.error.message}</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
