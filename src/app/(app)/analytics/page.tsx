import type { Metadata } from "next";
import {
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  Download,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarList } from "@/components/charts/bar-chart";
import {
  enrollmentTrend,
  programDistribution,
  gradeDistribution,
  collegePerformance,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Data Analysis" };

export default function AnalyticsPage() {
  const trend = enrollmentTrend.map((d) => ({
    label: d.term.replace(" 20", " '"),
    value: d.students,
  }));
  const totalGrades = gradeDistribution.reduce((s, g) => s + g.count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Analysis & Reports"
        description="Institutional trends and academic performance insights to support data-driven decisions."
      >
        <Button variant="outline" size="md">
          <BarChart3 className="h-4 w-4" />
          Custom report
        </Button>
        <Button size="md">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total enrollment", value: "4,312", delta: "+5.7%", tone: "bg-brand-50 text-brand-600" },
          { icon: Award, label: "Institutional GWA", value: "1.78", delta: "+2.1%", tone: "bg-accent-500/10 text-accent-600" },
          { icon: GraduationCap, label: "Graduation rate", value: "94.2%", delta: "+1.4%", tone: "bg-success-50 text-success-600" },
          { icon: TrendingUp, label: "Retention rate", value: "96.8%", delta: "+0.9%", tone: "bg-info-50 text-info-600" },
        ].map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", k.tone)}>
                <k.icon className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-700">
                <ArrowUpRight className="h-3 w-3" />
                {k.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-ink-900">{k.value}</p>
            <p className="mt-1 text-sm text-ink-500">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Trend + grade distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Enrollment Growth</CardTitle>
              <CardDescription>Term-over-term enrolled students</CardDescription>
            </div>
            <Badge tone="success" dot>+38% over 3 years</Badge>
          </CardHeader>
          <CardContent>
            <AreaChart data={trend} height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Institution-wide ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-5">
              <DonutChart
                data={gradeDistribution.map((g) => ({ label: g.label, value: g.count, color: g.color }))}
                centerValue={(totalGrades / 1000).toFixed(1) + "k"}
                centerLabel="grades"
              />
              <div className="w-full space-y-2">
                {gradeDistribution.map((g) => (
                  <div key={g.band} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
                      <span className="text-ink-600">{g.label}</span>
                      <span className="text-xs text-ink-400">{g.band}</span>
                    </span>
                    <span className="font-medium text-ink-800">{g.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program enrollment + college performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Enrollment by Program</CardTitle>
              <CardDescription>Headcount per program</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BarList
              data={programDistribution.map((p) => ({
                label: p.program,
                value: p.students,
                color: p.color,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Performance by College</CardTitle>
              <CardDescription>Average GWA and pass rate</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">College</th>
                    <th className="px-5 py-2.5 font-medium">Avg GWA</th>
                    <th className="px-5 py-2.5 font-medium">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {collegePerformance.map((c) => (
                    <tr key={c.college} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-medium text-ink-900">{c.college}</td>
                      <td className="px-5 py-3">
                        <Badge tone={c.gwa <= 1.8 ? "success" : c.gwa <= 2.0 ? "brand" : "warning"}>
                          {c.gwa.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={c.passRate} className="w-20" tone="success" />
                          <span className="text-xs font-medium text-ink-600">{c.passRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight banner */}
      <Card className="overflow-hidden border-0">
        <div className="relative flex flex-col items-start gap-4 bg-gradient-to-r from-brand-600 to-accent-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-bold">Computing enrollment is up 14% this term</p>
              <p className="mt-0.5 text-sm text-white/80">
                Consider opening additional sections for CS 311 and IT 241 to meet demand.
              </p>
            </div>
          </div>
          <Button size="md" className="bg-white text-brand-700 hover:bg-white/90">
            View recommendation
          </Button>
        </div>
      </Card>
    </div>
  );
}
