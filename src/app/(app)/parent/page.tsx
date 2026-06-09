"use client";

import { useState } from "react";
import { Users, Award, CalendarCheck, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery } from "@/hooks/use-query";
import { parentApi } from "@/lib/api/endpoints";
import type { AttendanceEntry, Grade, ID, StudentFee } from "@/lib/api/types";
import { cn, formatCurrency } from "@/lib/utils";

interface Child {
  id: ID;
  name?: string;
  first_name?: string;
  last_name?: string;
  lrn?: string;
  grade_level?: { name?: string };
  section?: { name?: string };
}

function childName(c: Child) {
  return c.name || `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || `Child #${c.id}`;
}

export default function ParentPortalPage() {
  const children = useQuery(() => parentApi.children(), []);
  const rows = (children.data?.data ?? []) as Child[];
  const [activeId, setActiveId] = useState<ID | null>(null);
  const currentId = activeId ?? rows[0]?.id ?? null;
  const current = rows.find((c) => c.id === currentId) ?? rows[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Parent Portal" description="Monitor your children's grades, attendance, and balances." />

      {children.loading ? (
        <LoadingState rows={3} />
      ) : children.error ? (
        <ErrorState error={children.error} onRetry={children.refetch} />
      ) : rows.length === 0 ? (
        <EmptyState icon={Users} title="No linked children" description="Children linked to your account will appear here." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((c) => {
              const active = currentId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                    active ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200" : "border-ink-200 bg-white hover:border-ink-300",
                  )}
                >
                  <Avatar name={childName(c)} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{childName(c)}</p>
                    <p className="truncate text-xs text-ink-400">
                      {c.grade_level?.name ?? c.lrn ?? `ID ${c.id}`}
                      {c.section?.name ? ` · ${c.section.name}` : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {current && <ChildDetail key={String(current.id)} childId={current.id} />}
        </>
      )}
    </div>
  );
}

function ChildDetail({ childId }: { childId: ID }) {
  const grades = useQuery(() => parentApi.childGrades(childId), [childId]);
  const attendance = useQuery(() => parentApi.childAttendance(childId), [childId]);
  const fees = useQuery(() => parentApi.childFees(childId), [childId]);

  const gradeRows = (grades.data?.data ?? []) as Grade[];
  const attRows = (attendance.data?.data ?? []) as AttendanceEntry[];
  const feeRows = (fees.data?.data ?? []) as StudentFee[];

  const avg = gradeRows.length ? Math.round(gradeRows.reduce((s, g) => s + (g.grade ?? 0), 0) / gradeRows.length) : null;
  const present = attRows.filter((a) => a.status === "present").length;
  const attRate = attRows.length ? Math.round((present / attRows.length) * 100) : null;
  const balance = feeRows.reduce((s, f) => s + (f.balance ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Award} label="Average" value={avg != null ? String(avg) : "—"} tone="bg-brand-50 text-brand-600" />
        <Stat icon={CalendarCheck} label="Attendance" value={attRate != null ? `${attRate}%` : "—"} tone="bg-success-50 text-success-600" />
        <Stat icon={Wallet} label="Balance" value={formatCurrency(balance)} tone="bg-warning-50 text-warning-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Grades</CardTitle>
              <CardDescription>Latest quarterly ratings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {grades.loading ? <LoadingState rows={4} /> : grades.error ? <ErrorState error={grades.error} onRetry={grades.refetch} /> : gradeRows.length === 0 ? (
              <EmptyState title="No grades yet" />
            ) : (
              <div className="space-y-2">
                {gradeRows.map((g, i) => (
                  <div key={g.id ?? i} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-sm">
                    <span className="text-ink-700">{g.subject?.name ?? "Subject"}</span>
                    <Badge tone={g.grade >= 75 ? "success" : "danger"}>{g.grade}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Fees & Balance</CardTitle>
              <CardDescription>Assessed fees this school year</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {fees.loading ? <LoadingState rows={4} /> : fees.error ? <ErrorState error={fees.error} onRetry={fees.refetch} /> : feeRows.length === 0 ? (
              <EmptyState title="No fees assigned" />
            ) : (
              <div className="space-y-2">
                {feeRows.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-sm">
                    <span className="text-ink-700">{f.fee_structure?.name ?? f.name ?? "Fee"}</span>
                    <span className="font-medium text-ink-900">{formatCurrency(f.balance ?? f.amount)}</span>
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

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Award; label: string; value: string; tone: string }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-xl font-bold text-ink-900">{value}</p>
        <p className="text-sm text-ink-500">{label}</p>
      </div>
    </Card>
  );
}
