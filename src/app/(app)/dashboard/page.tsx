"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  School,
  ClipboardList,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery } from "@/hooks/use-query";
import { useAuth } from "@/lib/auth";
import { dashboardApi, enrollmentApi, usersApi } from "@/lib/api/endpoints";
import type { Enrollment, User } from "@/lib/api/types";

const quickActions = [
  { label: "Enrollment", href: "/enrollment", icon: GraduationCap, tone: "bg-brand-50 text-brand-600" },
  { label: "Classes & Grading", href: "/classes", icon: BookOpenCheck, tone: "bg-accent-500/10 text-accent-600" },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck, tone: "bg-info-50 text-info-600" },
  { label: "Fees & Payments", href: "/finance", icon: Wallet, tone: "bg-success-50 text-success-600" },
];

function num(v: unknown, fallback = "—") {
  return typeof v === "number" ? v.toLocaleString() : fallback;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const summary = useQuery(() => dashboardApi.summary(), []);
  const pending = useQuery(() => enrollmentApi.list({ status: "pending", per_page: 6 }), []);
  const recentUsers = useQuery(() => usersApi.list({ per_page: 6 }), []);

  const s = (summary.data?.data ?? {}) as Record<string, unknown>;
  const pendingRows: Enrollment[] = (pending.data?.data ?? []) as Enrollment[];
  const userRows: User[] = (recentUsers.data?.data ?? []) as User[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.profile?.first_name ?? user?.name ?? "Admin"} 👋`}
        description="A live snapshot of enrollment, academics, and activity across the institution."
      >
        <Link
          href="/enrollment"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          Manage enrollment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      {/* KPIs */}
      {summary.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-32 animate-pulse" />
          ))}
        </div>
      ) : summary.error ? (
        <ErrorState error={summary.error} onRetry={summary.refetch} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Students" value={num(s.total_students)} icon={Users} tone="brand" />
          <StatCard label="Total Teachers" value={num(s.total_teachers)} icon={GraduationCap} tone="accent" />
          <StatCard label="Sections" value={num(s.total_sections)} icon={School} tone="success" />
          <StatCard label="Pending Enrollments" value={num(s.pending_enrollments ?? pendingRows.length)} icon={ClipboardList} tone="warning" />
        </div>
      )}

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Pending Enrollments</CardTitle>
              <CardDescription>Applications awaiting review</CardDescription>
            </div>
            <Link href="/enrollment" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {pending.loading ? (
              <LoadingState rows={4} />
            ) : pending.error ? (
              <ErrorState error={pending.error} onRetry={pending.refetch} />
            ) : pendingRows.length === 0 ? (
              <EmptyState title="No pending enrollments" description="New applications will appear here." />
            ) : (
              <div className="space-y-2">
                {pendingRows.map((e) => {
                  const name =
                    e.student?.name ??
                    `${e.student?.first_name ?? ""} ${e.student?.last_name ?? ""}`.trim() ??
                    `Student #${e.student_id}`;
                  return (
                    <div key={e.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                      <Avatar name={name || "Student"} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-900">{name || `Student #${e.student_id}`}</p>
                        <p className="truncate text-xs text-ink-400">
                          {e.grade_level?.name ?? `Grade level #${e.grade_level_id}`}
                          {e.section?.name ? ` · ${e.section.name}` : ""}
                        </p>
                      </div>
                      <Badge tone="warning" dot>{e.status}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Accounts</CardTitle>
              <CardDescription>Newly added users</CardDescription>
            </div>
            <Link href="/users" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              All
            </Link>
          </CardHeader>
          <CardContent>
            {recentUsers.loading ? (
              <LoadingState rows={4} />
            ) : recentUsers.error ? (
              <ErrorState error={recentUsers.error} onRetry={recentUsers.refetch} />
            ) : userRows.length === 0 ? (
              <EmptyState title="No users yet" />
            ) : (
              <div className="space-y-2.5">
                {userRows.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900">{u.name}</p>
                      <p className="truncate text-xs text-ink-400">{u.email}</p>
                    </div>
                    <Badge tone="neutral">{u.role}</Badge>
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
