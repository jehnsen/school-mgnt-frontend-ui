"use client";

import { useMemo, useState } from "react";
import {
  Save,
  Send,
  Calculator,
  Users,
  TrendingUp,
  CheckCircle2,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { gradeRows, courses, students } from "@/lib/data";
import { cn } from "@/lib/utils";

// Weights: Prelim 30%, Midterm 30%, Finals 40%
const WEIGHTS = { prelim: 0.3, midterm: 0.3, finals: 0.4 };

function computeFinal(p: number | null, m: number | null, f: number | null) {
  if (p == null || m == null || f == null) return null;
  return p * WEIGHTS.prelim + m * WEIGHTS.midterm + f * WEIGHTS.finals;
}

// Convert percentage to PH 5-point equivalent
function equivalent(pct: number | null): { grade: string; tone: "success" | "brand" | "info" | "warning" | "danger" } {
  if (pct == null) return { grade: "—", tone: "info" };
  if (pct >= 96) return { grade: "1.00", tone: "success" };
  if (pct >= 93) return { grade: "1.25", tone: "success" };
  if (pct >= 90) return { grade: "1.50", tone: "success" };
  if (pct >= 87) return { grade: "1.75", tone: "brand" };
  if (pct >= 84) return { grade: "2.00", tone: "brand" };
  if (pct >= 81) return { grade: "2.25", tone: "info" };
  if (pct >= 78) return { grade: "2.50", tone: "info" };
  if (pct >= 75) return { grade: "2.75", tone: "warning" };
  if (pct >= 70) return { grade: "3.00", tone: "warning" };
  return { grade: "5.00", tone: "danger" };
}

interface Row {
  studentId: string;
  studentName: string;
  prelim: number | null;
  midterm: number | null;
  finals: number | null;
}

export default function GradingPage() {
  const classCourses = courses.slice(0, 4);
  const [activeCourse, setActiveCourse] = useState(classCourses[0].code);

  const baseRows: Row[] = useMemo(() => {
    const existing = gradeRows.filter((g) => g.course === activeCourse);
    if (existing.length) {
      return existing.map((g) => ({
        studentId: g.studentId,
        studentName: g.studentName,
        prelim: g.prelim,
        midterm: g.midterm,
        finals: g.finals,
      }));
    }
    // Fall back to a roster from students
    return students.slice(0, 6).map((s) => ({
      studentId: s.id,
      studentName: s.name,
      prelim: 88,
      midterm: 90,
      finals: 87,
    }));
  }, [activeCourse]);

  const [rows, setRows] = useState<Row[]>(baseRows);

  // reset rows when course changes
  const [lastCourse, setLastCourse] = useState(activeCourse);
  if (lastCourse !== activeCourse) {
    setLastCourse(activeCourse);
    setRows(baseRows);
  }

  const update = (idx: number, field: keyof Row, value: string) => {
    const num = value === "" ? null : Math.min(100, Math.max(0, Number(value)));
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: num } : r)),
    );
  };

  const finals = rows.map((r) => computeFinal(r.prelim, r.midterm, r.finals));
  const posted = finals.filter((f) => f != null);
  const classAvg = posted.length
    ? posted.reduce((s, f) => s + (f as number), 0) / posted.length
    : 0;
  const passing = finals.filter((f) => f != null && f >= 75).length;
  const passRate = posted.length ? Math.round((passing / posted.length) * 100) : 0;
  const course = courses.find((c) => c.code === activeCourse);
  const avatarColor = (id: string) =>
    students.find((s) => s.id === id)?.avatarColor ?? "#6366f1";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Online Grading System"
        description="Encode term grades, compute final ratings automatically, and post results for retrieval."
      >
        <Button variant="outline" size="md">
          <Download className="h-4 w-4" />
          Export sheet
        </Button>
        <Button variant="secondary" size="md">
          <Save className="h-4 w-4" />
          Save draft
        </Button>
        <Button size="md">
          <Send className="h-4 w-4" />
          Post grades
        </Button>
      </PageHeader>

      {/* Class tabs */}
      <div className="flex flex-wrap gap-2">
        {classCourses.map((c) => (
          <button
            key={c.code}
            onClick={() => setActiveCourse(c.code)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-left transition-colors",
              activeCourse === c.code
                ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200"
                : "border-ink-200 bg-white hover:border-ink-300",
            )}
          >
            <p className={cn("text-sm font-semibold", activeCourse === c.code ? "text-brand-700" : "text-ink-800")}>
              {c.code}
            </p>
            <p className="text-xs text-ink-400">{c.enrolled} students</p>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "Enrolled in class", value: `${course?.enrolled ?? rows.length}`, tone: "bg-brand-50 text-brand-600" },
          { icon: Calculator, label: "Class average", value: classAvg ? classAvg.toFixed(1) + "%" : "—", tone: "bg-accent-500/10 text-accent-600" },
          { icon: TrendingUp, label: "Passing rate", value: passRate + "%", tone: "bg-success-50 text-success-600" },
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

      {/* Grade sheet */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{activeCourse} · {course?.title}</CardTitle>
            <CardDescription>
              Prelim 30% · Midterm 30% · Finals 40% — equivalent computed automatically
            </CardDescription>
          </div>
          <Badge tone="info" dot>Draft</Badge>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-3 py-3 text-center font-medium">Prelim</th>
                  <th className="px-3 py-3 text-center font-medium">Midterm</th>
                  <th className="px-3 py-3 text-center font-medium">Finals</th>
                  <th className="px-3 py-3 text-center font-medium">Final %</th>
                  <th className="px-5 py-3 text-center font-medium">Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((r, idx) => {
                  const fin = finals[idx];
                  const eq = equivalent(fin);
                  return (
                    <tr key={r.studentId} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.studentName} color={avatarColor(r.studentId)} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900">{r.studentName}</p>
                            <p className="text-xs text-ink-400">{r.studentId}</p>
                          </div>
                        </div>
                      </td>
                      {(["prelim", "midterm", "finals"] as const).map((field) => (
                        <td key={field} className="px-3 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={r[field] ?? ""}
                            onChange={(e) => update(idx, field, e.target.value)}
                            className="h-9 w-16 rounded-lg border border-ink-200 bg-white text-center text-sm font-medium text-ink-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center font-display font-bold text-ink-900">
                        {fin != null ? fin.toFixed(1) : "—"}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge tone={eq.tone}>{eq.grade}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm">
            <span className="flex items-center gap-1.5 text-ink-500">
              <CheckCircle2 className="h-4 w-4 text-success-500" />
              Auto-saved as draft
            </span>
            <span className="text-ink-500">
              Class average:{" "}
              <span className="font-semibold text-ink-900">
                {classAvg ? classAvg.toFixed(1) + "%" : "—"}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
