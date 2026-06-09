import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  Circle,
  Lock,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { curriculum, students } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Student Advising" };

const statusMeta = {
  Passed: { icon: CheckCircle2, tone: "success" as const, iconClass: "text-success-500" },
  "In Progress": { icon: Clock, tone: "info" as const, iconClass: "text-info-500" },
  "Not Taken": { icon: Circle, tone: "neutral" as const, iconClass: "text-ink-300" },
  Locked: { icon: Lock, tone: "warning" as const, iconClass: "text-warning-500" },
};

export default function AdvisingPage() {
  const student = students[0];
  const passed = curriculum.filter((c) => c.status === "Passed");
  const inProgress = curriculum.filter((c) => c.status === "In Progress");
  const totalUnits = curriculum.reduce((s, c) => s + c.units, 0);
  const earnedUnits = passed.reduce((s, c) => s + c.units, 0);
  const pct = Math.round((earnedUnits / totalUnits) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Advising"
        description="Guide advisees through curriculum requirements, track progress, and recommend the next term's subjects."
      >
        <Button variant="outline" size="md">
          <MessageSquare className="h-4 w-4" />
          Add advising note
        </Button>
        <Button size="md">
          <ClipboardCheck className="h-4 w-4" />
          Approve plan
        </Button>
      </PageHeader>

      {/* Advisee header */}
      <Card className="p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} color={student.avatarColor} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-bold text-ink-900">{student.name}</p>
                <Badge tone="brand">{student.type}</Badge>
              </div>
              <p className="text-sm text-ink-500">
                {student.id} · {student.program} · Year {student.yearLevel} · {student.section}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "GWA", value: student.gpa.toFixed(2), icon: Award },
              { label: "Units earned", value: `${earnedUnits}`, icon: BookOpen },
              { label: "Standing", value: "Good", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto h-4 w-4 text-brand-500" />
                <p className="mt-1 font-display text-xl font-bold text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Curriculum checklist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Curriculum Checklist</CardTitle>
              <CardDescription>BS Computer Science · 2023 Curriculum</CardDescription>
            </div>
            <Badge tone="success" dot>{pct}% complete</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-ink-500">{earnedUnits} of {totalUnits} units earned</span>
                <span className="font-medium text-ink-700">{pct}%</span>
              </div>
              <Progress value={pct} tone="success" />
            </div>

            <div className="space-y-2">
              {curriculum.map((c) => {
                const meta = statusMeta[c.status];
                const Icon = meta.icon;
                return (
                  <div
                    key={c.code}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-3.5",
                      c.status === "In Progress" ? "border-info-500/30 bg-info-50/40" : "border-ink-200",
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", meta.iconClass)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink-900">{c.code}</span>
                        <span className="text-xs text-ink-400">{c.units} units</span>
                      </div>
                      <p className="truncate text-sm text-ink-600">{c.title}</p>
                    </div>
                    <div className="text-right">
                      {c.grade !== "—" && (
                        <p className="font-display text-sm font-bold text-ink-900">{c.grade}</p>
                      )}
                      <Badge tone={meta.tone}>{c.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations + notes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Term</CardTitle>
              <CardDescription>Based on prerequisites & standing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { code: "CS 401", title: "Operating Systems", units: 3, ready: true },
                { code: "CS 402", title: "Compiler Design", units: 3, ready: true },
                { code: "CS 410", title: "Computer Networks", units: 3, ready: true },
                { code: "CS 499", title: "Capstone Project", units: 6, ready: false },
              ].map((c) => (
                <div key={c.code} className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-800">{c.code}</p>
                    <p className="truncate text-xs text-ink-400">{c.title}</p>
                  </div>
                  {c.ready ? (
                    <Badge tone="success">Eligible</Badge>
                  ) : (
                    <Badge tone="warning">Locked</Badge>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2.5 text-sm">
                <span className="font-medium text-brand-700">Recommended load</span>
                <span className="font-display font-bold text-brand-700">9–12 units</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent-600" />
                Advising Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: "Jun 02, 2026", note: "Discussed capstone topic options. Student leaning toward ML.", by: "Dr. Marquez" },
                { date: "Jan 15, 2026", note: "On track to graduate on time. Strong performance in core CS.", by: "Dr. Marquez" },
              ].map((n) => (
                <div key={n.date} className="rounded-xl border border-ink-100 p-3">
                  <p className="text-sm text-ink-700">{n.note}</p>
                  <p className="mt-1.5 text-xs text-ink-400">{n.by} · {n.date}</p>
                </div>
              ))}
              <textarea
                rows={2}
                placeholder="Write a new advising note…"
                className="w-full resize-none rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 text-sm focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button size="sm" className="w-full">Save note</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
