import type { Metadata } from "next";
import {
  CalendarRange,
  Users,
  Gauge,
  AlertTriangle,
  Plus,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ColumnChart } from "@/components/charts/bar-chart";
import { faculty, courses } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Faculty Loading" };

export default function FacultyLoadingPage() {
  const totalCapacity = faculty.reduce((s, f) => s + f.maxUnits, 0);
  const totalLoad = faculty.reduce((s, f) => s + f.loadUnits, 0);
  const utilization = Math.round((totalLoad / totalCapacity) * 100);
  const overloaded = faculty.filter((f) => f.loadUnits >= f.maxUnits);
  const underloaded = faculty.filter((f) => f.loadUnits < f.maxUnits * 0.6);

  const deptLoad = Array.from(
    faculty.reduce((map, f) => {
      map.set(f.department, (map.get(f.department) ?? 0) + f.loadUnits);
      return map;
    }, new Map<string, number>()),
  ).map(([dept, units]) => ({ label: dept.split(" ")[0], value: units }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Loading"
        description="Distribute teaching loads optimally based on institutional policies, ranks, and unit limits."
      >
        <Button variant="outline" size="md">
          <TrendingUp className="h-4 w-4" />
          Balance loads
        </Button>
        <Button size="md">
          <Plus className="h-4 w-4" />
          Assign load
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink-900">{faculty.length}</p>
            <p className="text-sm text-ink-500">Faculty members</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink-900">{utilization}%</p>
            <p className="text-sm text-ink-500">Capacity utilized</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink-900">{overloaded.length}</p>
            <p className="text-sm text-ink-500">At max load</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-50 text-info-600">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink-900">{totalLoad}</p>
            <p className="text-sm text-ink-500">Units assigned</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Faculty load table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Faculty Workload</CardTitle>
              <CardDescription>Load vs. maximum allowed units per faculty</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {faculty.map((f) => {
              const pct = (f.loadUnits / f.maxUnits) * 100;
              const tone = pct >= 100 ? "danger" : pct >= 80 ? "warning" : pct < 60 ? "accent" : "brand";
              return (
                <div key={f.id} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={f.name} color={f.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink-900">{f.name}</p>
                      <p className="truncate text-xs text-ink-400">
                        {f.rank} · {f.department} · {f.sections} sections
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-bold text-ink-900">
                        {f.loadUnits}
                        <span className="font-normal text-ink-400">/{f.maxUnits} units</span>
                      </p>
                      <Badge
                        tone={pct >= 100 ? "danger" : pct < 60 ? "info" : "success"}
                        className="mt-0.5"
                      >
                        {pct >= 100 ? "Full" : pct < 60 ? "Available" : "Optimal"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={pct} tone={tone} className="mt-3" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Dept distribution + alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Load by Department</CardTitle>
              <CardDescription>Assigned units</CardDescription>
            </CardHeader>
            <CardContent>
              <ColumnChart data={deptLoad} valueSuffix=" u" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning-500" />
                Balancing Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {overloaded.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl bg-danger-50 px-3 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-danger-500" />
                  <p className="flex-1 text-sm text-ink-700">
                    <span className="font-medium">{f.name}</span> is at maximum load
                  </p>
                </div>
              ))}
              {underloaded.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl bg-info-50 px-3 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-info-500" />
                  <p className="flex-1 text-sm text-ink-700">
                    <span className="font-medium">{f.name}</span> can take {f.maxUnits - f.loadUnits} more units
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unassigned sections */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Sections Awaiting Assignment</CardTitle>
            <CardDescription>Open teaching slots for this term</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-2.5 font-medium">Subject</th>
                  <th className="px-5 py-2.5 font-medium">Units</th>
                  <th className="px-5 py-2.5 font-medium">Schedule</th>
                  <th className="px-5 py-2.5 font-medium">Suggested Faculty</th>
                  <th className="px-5 py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {courses.slice(0, 5).map((c, i) => (
                  <tr key={c.code} className="hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-900">{c.code}</p>
                      <p className="text-xs text-ink-400">{c.title}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-600">{c.units}</td>
                    <td className="px-5 py-3 text-ink-600">{c.schedule}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={faculty[i % faculty.length].name} color={faculty[i % faculty.length].avatarColor} size="sm" />
                        <span className="text-ink-700">{faculty[i % faculty.length].name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="outline">Assign</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
