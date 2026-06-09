"use client";

import { Award, BookOpen, CalendarCheck, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery } from "@/hooks/use-query";
import { useAuth } from "@/lib/auth";
import { classesApi, attendanceApi } from "@/lib/api/endpoints";
import type { AttendanceEntry, Grade } from "@/lib/api/types";

function gradeTone(g: number) {
  if (g >= 90) return "success" as const;
  if (g >= 85) return "brand" as const;
  if (g >= 75) return "info" as const;
  return "danger" as const;
}

export default function StudentPortalPage() {
  const { user } = useAuth();
  const grades = useQuery(() => classesApi.myGrades(), []);
  const attendance = useQuery(() => attendanceApi.myAttendance(), []);

  const gradeRows = (grades.data?.data ?? []) as Grade[];
  const attRows = (attendance.data?.data ?? []) as AttendanceEntry[];

  const avg =
    gradeRows.length > 0
      ? Math.round(gradeRows.reduce((s, g) => s + (g.grade ?? 0), 0) / gradeRows.length)
      : null;
  const present = attRows.filter((a) => a.status === "present").length;
  const attRate = attRows.length > 0 ? Math.round((present / attRows.length) * 100) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${user?.first_name ?? user?.name ?? "Learner"} 👋`}
        description="Your grades, attendance, and academic progress at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="General Average" value={avg != null ? String(avg) : "—"} icon={Award} tone="brand" />
        <StatCard label="Attendance Rate" value={attRate != null ? `${attRate}%` : "—"} icon={CalendarCheck} tone="success" />
        <StatCard label="Subjects" value={String(gradeRows.length || "—")} icon={BookOpen} tone="accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>My Grades</CardTitle>
              <CardDescription>Quarterly ratings for the current school year</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {grades.loading ? (
              <div className="p-5"><LoadingState rows={5} /></div>
            ) : grades.error ? (
              <ErrorState error={grades.error} onRetry={grades.refetch} className="m-5" />
            ) : gradeRows.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No grades posted yet" className="m-5" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                      <th className="px-5 py-2.5 font-medium">Subject</th>
                      <th className="px-5 py-2.5 font-medium">Period</th>
                      <th className="px-5 py-2.5 text-center font-medium">Grade</th>
                      <th className="px-5 py-2.5 text-center font-medium">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {gradeRows.map((g, i) => (
                      <tr key={g.id ?? i} className="hover:bg-ink-50/60">
                        <td className="px-5 py-3 font-medium text-ink-900">{g.subject?.name ?? "—"}</td>
                        <td className="px-5 py-3 text-ink-600">{String(g.grading_period).replace("_", " ")}</td>
                        <td className="px-5 py-3 text-center font-display font-bold text-ink-900">{g.grade}</td>
                        <td className="px-5 py-3 text-center">
                          <Badge tone={gradeTone(g.grade)}>{g.grade >= 75 ? "Passed" : "Failed"}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>{attRate != null ? `${attRate}% present` : "—"}</CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.loading ? (
              <LoadingState rows={4} />
            ) : attendance.error ? (
              <ErrorState error={attendance.error} onRetry={attendance.refetch} />
            ) : attRows.length === 0 ? (
              <EmptyState title="No attendance records" />
            ) : (
              <div className="space-y-2">
                {attRows.slice(0, 8).map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-sm">
                    <span className="text-ink-600">{a.date ?? "—"}</span>
                    <Badge tone={a.status === "present" ? "success" : a.status === "late" ? "warning" : "danger"}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
