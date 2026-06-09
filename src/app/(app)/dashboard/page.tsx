import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpenCheck,
  TrendingUp,
  ArrowRight,
  CalendarRange,
  FileText,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import {
  enrollmentTrend,
  programDistribution,
  students,
  announcements,
  documentRequests,
} from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

const quickActions = [
  { label: "New Enrollment", href: "/enrollment", icon: GraduationCap, tone: "bg-brand-50 text-brand-600" },
  { label: "Encode Grades", href: "/grading", icon: BookOpenCheck, tone: "bg-accent-500/10 text-accent-600" },
  { label: "Advise Student", href: "/advising", icon: ClipboardCheck, tone: "bg-info-50 text-info-600" },
  { label: "Faculty Load", href: "/faculty-loading", icon: CalendarRange, tone: "bg-success-50 text-success-600" },
];

export default function DashboardPage() {
  const trend = enrollmentTrend.map((d) => ({
    label: d.term.replace(" 20", " '"),
    value: d.students,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Dr. Marquez 👋"
        description="Here's what's happening across the institution this term."
      >
        <ButtonLink href="/analytics" variant="outline" size="md">
          <TrendingUp className="h-4 w-4" />
          View reports
        </ButtonLink>
        <ButtonLink href="/enrollment" size="md">
          New enrollment
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Enrolled" value="4,312" icon={Users} trend={5.7} trendLabel="vs. last term" tone="brand" />
        <StatCard label="New Applicants" value="318" icon={GraduationCap} trend={12.4} trendLabel="this enrollment period" tone="accent" />
        <StatCard label="Avg. GWA" value="1.78" icon={BookOpenCheck} trend={2.1} trendLabel="institution-wide" tone="success" />
        <StatCard label="Faculty Load" value="92%" icon={CalendarRange} trend={-1.3} trendLabel="capacity utilized" tone="info" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Enrollment Trend</CardTitle>
              <CardDescription>Total enrolled students per term</CardDescription>
            </div>
            <Badge tone="success" dot>
              +38% over 3 years
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaChart data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Program Mix</CardTitle>
              <CardDescription>Distribution by program</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-5">
              <DonutChart
                data={programDistribution.map((p) => ({ label: p.program, value: p.students, color: p.color }))}
                centerValue="4,312"
                centerLabel="students"
              />
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
                {programDistribution.slice(0, 6).map((p) => (
                  <div key={p.program} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                    <span className="truncate text-xs text-ink-600">{p.program}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex items-center gap-4 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.tone}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <span className="flex-1 text-sm font-semibold text-ink-800">{a.label}</span>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent students */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent Enrollees</CardTitle>
              <CardDescription>Latest student registrations this period</CardDescription>
            </div>
            <Link href="/enrollment" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">Student</th>
                    <th className="px-5 py-2.5 font-medium">Program</th>
                    <th className="px-5 py-2.5 font-medium">Type</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {students.slice(0, 6).map((s) => (
                    <tr key={s.id} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} color={s.avatarColor} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900">{s.name}</p>
                            <p className="text-xs text-ink-400">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-600">{s.program}</td>
                      <td className="px-5 py-3">
                        <Badge tone={s.type === "Regular" ? "brand" : "warning"}>{s.type}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={
                            s.status === "Enrolled"
                              ? "success"
                              : s.status === "Irregular"
                                ? "warning"
                                : s.status === "Pending"
                                  ? "info"
                                  : "neutral"
                          }
                          dot
                        >
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Announcements + pending docs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-brand-600" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((a) => (
                <div key={a.title} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <Badge tone="brand">{a.tag}</Badge>
                    <span className="text-xs text-ink-400">{a.date}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-900">{a.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{a.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-600" />
                Pending Documents
              </CardTitle>
              <Link href="/registrar" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                All
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {documentRequests
                .filter((d) => d.status !== "Released")
                .slice(0, 4)
                .map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-800">{d.type}</p>
                      <p className="truncate text-xs text-ink-400">{d.student}</p>
                    </div>
                    <Badge tone={d.status === "Processing" ? "info" : d.status === "On Hold" ? "danger" : "warning"}>
                      {d.status}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
