import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Wallet,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  CreditCard,
  Bell,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { students, courses, weeklySchedule, announcements, gradeRows } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "My Portal" };

const courseColor: Record<string, string> = {
  "CS 311": "#6366f1",
  "CS 312": "#a855f7",
  "IT 241": "#ec4899",
  "GE 105": "#f59e0b",
};

export default function PortalPage() {
  const student = students[0];
  const myCourses = courses.filter((c) => ["CS 311", "CS 312", "GE 105"].includes(c.code));
  const myUnits = myCourses.reduce((s, c) => s + c.units, 0);
  const myGrades = gradeRows.filter((g) => g.studentId === student.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Portal"
        description="Your personal hub for academic and administrative services."
      >
        <ButtonLink href="/registrar" variant="outline" size="md">
          <FileText className="h-4 w-4" />
          Request document
        </ButtonLink>
        <ButtonLink href="/enrollment" size="md">
          <GraduationCap className="h-4 w-4" />
          Enroll subjects
        </ButtonLink>
      </PageHeader>

      {/* Profile hero */}
      <Card className="overflow-hidden border-0">
        <div className="relative bg-gradient-to-br from-ink-950 via-brand-900 to-accent-900 p-6 text-white">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={student.name} color={student.avatarColor} size="lg" className="h-16 w-16 text-xl ring-white/30" />
              <div>
                <h2 className="font-display text-xl font-bold">{student.name}</h2>
                <p className="text-sm text-white/70">
                  {student.id} · {student.program}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                    Year {student.yearLevel}
                  </span>
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                    {student.section}
                  </span>
                  <span className="rounded-full bg-success-500/30 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Award, label: "GWA", value: student.gpa.toFixed(2) },
                { icon: BookOpen, label: "Units", value: `${myUnits}` },
                { icon: TrendingUp, label: "Standing", value: "Good" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                  <s.icon className="mx-auto h-4 w-4 text-brand-200" />
                  <p className="mt-1 font-display text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600" />
              Weekly Schedule
            </CardTitle>
            <Badge tone="brand">2nd Sem · SY 2025–26</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              {weeklySchedule.map((day) => (
                <div key={day.day} className="rounded-xl border border-ink-100 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                    {day.day.slice(0, 3)}
                  </p>
                  <div className="space-y-2">
                    {day.classes.map((cls, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-2 text-xs"
                        style={{
                          background: `${courseColor[cls.code] ?? "#6366f1"}15`,
                          borderLeft: `3px solid ${courseColor[cls.code] ?? "#6366f1"}`,
                        }}
                      >
                        <p className="font-semibold text-ink-800">{cls.code}</p>
                        <p className="text-ink-500">{cls.time}</p>
                        <p className="text-ink-400">{cls.room}</p>
                      </div>
                    ))}
                    {day.classes.length === 0 && (
                      <p className="text-xs text-ink-300">No class</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account / balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-accent-600" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
              <p className="text-xs text-white/70">Outstanding balance</p>
              <p className="mt-1 font-display text-2xl font-bold">{formatCurrency(0)}</p>
              <p className="mt-1 text-xs text-white/70">Fully paid · No holds</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Total assessed</span>
                <span className="font-medium text-ink-800">{formatCurrency(36000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Total paid</span>
                <span className="font-medium text-success-600">{formatCurrency(36000)}</span>
              </div>
            </div>
            <ButtonLink href="/portal" variant="outline" size="md" className="w-full">
              <CreditCard className="h-4 w-4" />
              View statement
            </ButtonLink>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current grades */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Current Subjects & Grades</CardTitle>
              <CardDescription>This term's enrolled subjects</CardDescription>
            </div>
            <Link href="/portal" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Grade history
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">Subject</th>
                    <th className="px-5 py-2.5 font-medium">Units</th>
                    <th className="px-5 py-2.5 font-medium">Schedule</th>
                    <th className="px-5 py-2.5 font-medium">Faculty</th>
                    <th className="px-5 py-2.5 font-medium text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {myCourses.map((c) => {
                    const g = myGrades.find((x) => x.course === c.code);
                    const final = g && g.finals != null
                      ? (g.prelim! * 0.3 + g.midterm! * 0.3 + g.finals * 0.4).toFixed(1)
                      : null;
                    return (
                      <tr key={c.code} className="hover:bg-ink-50/60">
                        <td className="px-5 py-3">
                          <p className="font-medium text-ink-900">{c.code}</p>
                          <p className="text-xs text-ink-400">{c.title}</p>
                        </td>
                        <td className="px-5 py-3 text-ink-600">{c.units}</td>
                        <td className="px-5 py-3 text-ink-600">{c.schedule}</td>
                        <td className="px-5 py-3 text-ink-600">{c.faculty}</td>
                        <td className="px-5 py-3 text-center">
                          {final ? (
                            <Badge tone="success">{final}%</Badge>
                          ) : (
                            <Badge tone="info">Ongoing</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick services + announcements */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Download Certificate of Enrollment", icon: Download, href: "/registrar" },
                { label: "Request Transcript of Records", icon: FileText, href: "/registrar" },
                { label: "View Curriculum Checklist", icon: BookOpen, href: "/advising" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="flex items-center gap-3 rounded-xl border border-ink-100 px-3 py-2.5 text-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <s.icon className="h-4 w-4 text-brand-600" />
                  <span className="flex-1 font-medium text-ink-700">{s.label}</span>
                  <ChevronRight className="h-4 w-4 text-ink-300" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-warning-500" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.title} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <Badge tone="brand">{a.tag}</Badge>
                    <span className="text-xs text-ink-400">{a.date}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-900">{a.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{a.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
