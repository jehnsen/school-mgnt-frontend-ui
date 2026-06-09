"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Check,
  X,
  Search,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Users,
  ClipboardList,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses, students } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const MAX_UNITS = 24;

export default function EnrollmentPage() {
  const [selected, setSelected] = useState<string[]>(["CS 311", "CS 312", "GE 105"]);
  const [studentType, setStudentType] = useState<"Regular" | "Irregular">("Regular");
  const [query, setQuery] = useState("");
  const student = students[0];

  const toggle = (code: string) =>
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const selectedCourses = courses.filter((c) => selected.includes(c.code));
  const totalUnits = selectedCourses.reduce((s, c) => s + c.units, 0);
  const tuition = totalUnits * 1500 + 4500;

  const evaluation = [
    { label: "Prerequisites validated", ok: true },
    { label: "No outstanding balance", ok: true },
    { label: "Curriculum requirements met", ok: studentType === "Regular" },
    { label: "Adviser approval", ok: selected.length > 0 },
    { label: "Within max load (24 units)", ok: totalUnits <= MAX_UNITS },
  ];
  const cleared = evaluation.every((e) => e.ok);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Enrollment & Registration"
        description="Build the student's load, run the evaluation, and finalize registration for the term."
      >
        <Badge tone="success" dot>2nd Semester · SY 2025–2026</Badge>
      </PageHeader>

      {/* Student banner */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-gradient-to-r from-brand-600 to-accent-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} color="#ffffff" size="lg" className="!text-brand-700" />
            <div>
              <p className="font-display text-lg font-bold">{student.name}</p>
              <p className="text-sm text-white/80">
                {student.id} · {student.program} · Year {student.yearLevel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1 backdrop-blur">
            {(["Regular", "Irregular"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStudentType(t)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                  studentType === t ? "bg-white text-brand-700" : "text-white/80 hover:text-white",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course catalog */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Available Subjects</CardTitle>
                <CardDescription>
                  {studentType === "Irregular"
                    ? "Irregular students may pick across year levels subject to prerequisites."
                    : "Recommended subjects for the student's curriculum block."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subject code or title…"
                  className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50 pl-10 pr-4 text-sm focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-2.5">
                {filtered.map((c) => {
                  const isSelected = selected.includes(c.code);
                  const full = c.enrolled >= c.slots;
                  return (
                    <div
                      key={c.code}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-3.5 transition-colors",
                        isSelected ? "border-brand-300 bg-brand-50/60" : "border-ink-200 hover:border-ink-300",
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-center ring-1 ring-ink-200">
                        <span className="font-display text-sm font-bold text-brand-700">{c.units}</span>
                        <span className="text-[9px] uppercase text-ink-400">units</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-ink-900">{c.code}</span>
                          {c.prerequisite && (
                            <Badge tone="neutral">Prereq · {c.prerequisite}</Badge>
                          )}
                          {full && <Badge tone="danger">Full</Badge>}
                        </div>
                        <p className="truncate text-sm text-ink-600">{c.title}</p>
                        <p className="mt-0.5 text-xs text-ink-400">
                          {c.schedule} · {c.room} · {c.faculty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-ink-400">{c.enrolled}/{c.slots} slots</p>
                        <Button
                          size="sm"
                          variant={isSelected ? "outline" : "primary"}
                          onClick={() => toggle(c.code)}
                          className="mt-1.5"
                          disabled={full && !isSelected}
                        >
                          {isSelected ? (
                            <>
                              <X className="h-3.5 w-3.5" /> Remove
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" /> Add
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary / evaluation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Load Summary</CardTitle>
              <Badge tone={totalUnits > MAX_UNITS ? "danger" : "brand"}>
                {totalUnits}/{MAX_UNITS} units
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress
                value={(totalUnits / MAX_UNITS) * 100}
                tone={totalUnits > MAX_UNITS ? "danger" : "brand"}
              />

              <div className="space-y-2">
                {selectedCourses.length === 0 && (
                  <p className="rounded-xl bg-ink-50 px-3 py-6 text-center text-sm text-ink-400">
                    No subjects added yet.
                  </p>
                )}
                {selectedCourses.map((c) => (
                  <div key={c.code} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-ink-800">{c.code}</span>
                      <span className="ml-2 text-ink-400">{c.units} units</span>
                    </div>
                    <button onClick={() => toggle(c.code)} className="text-ink-400 hover:text-danger-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-ink-100 pt-4 text-sm">
                <div className="flex justify-between text-ink-500">
                  <span>Subjects</span>
                  <span className="font-medium text-ink-800">{selectedCourses.length}</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Total units</span>
                  <span className="font-medium text-ink-800">{totalUnits}</span>
                </div>
                <div className="flex items-center justify-between border-t border-ink-100 pt-2">
                  <span className="flex items-center gap-1.5 text-ink-500">
                    <Wallet className="h-4 w-4" /> Assessed tuition
                  </span>
                  <span className="font-display text-lg font-bold text-ink-900">
                    {formatCurrency(tuition)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-brand-600" />
                Enrollment Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evaluation.map((e) => (
                <div key={e.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full",
                      e.ok ? "bg-success-50 text-success-600" : "bg-warning-50 text-warning-600",
                    )}
                  >
                    {e.ok ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  </span>
                  <span className={cn(e.ok ? "text-ink-700" : "text-ink-500")}>{e.label}</span>
                </div>
              ))}

              <div
                className={cn(
                  "mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                  cleared ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700",
                )}
              >
                {cleared ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {cleared ? "Cleared for enrollment" : "Pending requirements"}
              </div>

              <Button size="lg" className="w-full" disabled={!cleared}>
                <GraduationCap className="h-4 w-4" />
                Finalize Enrollment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Period stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "Regular students enrolled", value: "3,684", tone: "bg-brand-50 text-brand-600" },
          { icon: GraduationCap, label: "Irregular evaluations", value: "412", tone: "bg-accent-500/10 text-accent-600" },
          { icon: ClipboardList, label: "Pending evaluations", value: "216", tone: "bg-warning-50 text-warning-600" },
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
    </div>
  );
}
