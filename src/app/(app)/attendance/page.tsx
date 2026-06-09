"use client";

import { useState } from "react";
import { CalendarCheck, Check, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { classesApi, attendanceApi } from "@/lib/api/endpoints";
import type { AttendanceStatus, Enrollment, ID, SchoolClass } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STATUSES: { value: AttendanceStatus; label: string; tone: string }[] = [
  { value: "present", label: "Present", tone: "bg-success-500" },
  { value: "absent", label: "Absent", tone: "bg-danger-500" },
  { value: "late", label: "Late", tone: "bg-warning-500" },
  { value: "excused", label: "Excused", tone: "bg-info-500" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const classes = useQuery(() => classesApi.myClasses(), []);
  const classRows = (classes.data?.data ?? []) as SchoolClass[];
  const [classId, setClassId] = useState<ID | null>(null);
  const currentId = classId ?? classRows[0]?.id ?? null;
  const [date, setDate] = useState(today());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark daily attendance for your classes."
      />

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">Class</span>
              <Select
                value={String(currentId ?? "")}
                onChange={(e) => setClassId(e.target.value)}
                disabled={classes.loading || classRows.length === 0}
              >
                {classRows.length === 0 && <option value="">No classes</option>}
                {classRows.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {(c.subject?.name ?? `Subject #${c.subject_id}`)} · {c.section?.name ?? `Sec #${c.section_id}`}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">Date</span>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
        </CardHeader>
        <CardContent>
          {classes.error ? (
            <ErrorState error={classes.error} onRetry={classes.refetch} />
          ) : currentId == null ? (
            <EmptyState icon={CalendarCheck} title="No classes to take attendance for" />
          ) : (
            <AttendanceSheet classId={currentId} date={date} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceSheet({ classId, date }: { classId: ID; date: string }) {
  const roster = useQuery(() => classesApi.students(classId), [classId]);
  const save = useMutation(
    (entries: { enrollment_id: ID; status: AttendanceStatus }[]) =>
      attendanceApi.mark(classId, date, entries),
  );
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const students = (roster.data?.data ?? []) as Enrollment[];

  function mark(id: ID, status: AttendanceStatus) {
    setSaved(false);
    setMarks((m) => ({ ...m, [String(id)]: status }));
  }

  async function handleSave() {
    const entries = students.map((e) => ({
      enrollment_id: e.id,
      status: marks[String(e.id)] ?? "present",
    }));
    await save.mutate(entries).then(() => setSaved(true)).catch(() => {});
  }

  if (roster.loading) return <LoadingState rows={6} />;
  if (roster.error) return <ErrorState error={roster.error} onRetry={roster.refetch} />;
  if (students.length === 0) return <EmptyState title="No students enrolled" />;

  const presentCount = students.filter((e) => (marks[String(e.id)] ?? "present") === "present").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {students.length} learners · <span className="font-medium text-success-600">{presentCount} present</span>
        </p>
        <Button onClick={handleSave} disabled={save.loading}>
          {save.loading ? <Save className="h-4 w-4 animate-pulse" /> : <Check className="h-4 w-4" />}
          {save.loading ? "Saving…" : "Save attendance"}
        </Button>
      </div>

      <div className="space-y-2">
        {students.map((e) => {
          const name =
            e.student?.name ||
            `${e.student?.first_name ?? ""} ${e.student?.last_name ?? ""}`.trim() ||
            `Student #${e.student_id}`;
          const current = marks[String(e.id)] ?? "present";
          return (
            <div key={e.id} className="flex flex-col gap-3 rounded-xl border border-ink-100 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={name} size="sm" />
                <span className="font-medium text-ink-900">{name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => mark(e.id, s.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      current === s.value
                        ? "border-transparent text-white"
                        : "border-ink-200 bg-white text-ink-500 hover:border-ink-300",
                    )}
                    style={current === s.value ? { background: toneColor(s.value) } : undefined}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", current === s.value ? "bg-white" : s.tone)} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end text-sm">
        {saved && <span className="font-medium text-success-600">Attendance saved ✓</span>}
        {save.error && <span className="font-medium text-danger-600">{save.error.message}</span>}
      </div>
    </div>
  );
}

function toneColor(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "#10b981";
    case "absent": return "#ef4444";
    case "late": return "#f59e0b";
    case "excused": return "#3b82f6";
    default: return "#6366f1";
  }
}
