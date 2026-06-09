"use client";

import { useState } from "react";
import { Check, X, GraduationCap, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { enrollmentApi } from "@/lib/api/endpoints";
import type { Enrollment, EnrollmentStatus, ID } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const statusTone: Record<string, "warning" | "success" | "danger" | "neutral"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const filters: { label: string; value: EnrollmentStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function EnrollmentPage() {
  const [status, setStatus] = useState<EnrollmentStatus | "">("pending");
  const [query, setQuery] = useState("");

  const list = useQuery(
    () => enrollmentApi.list({ status: status || undefined, per_page: 50 }),
    [status],
  );
  const approve = useMutation(enrollmentApi.approve);
  const reject = useMutation((id: ID, reason: string) => enrollmentApi.reject(id, reason));

  const rows = (list.data?.data ?? []).filter((e) => {
    const name = studentName(e).toLowerCase();
    return name.includes(query.toLowerCase());
  });

  async function onApprove(id: ID) {
    await approve.mutate(id).then(() => list.refetch()).catch(() => {});
  }
  async function onReject(id: ID) {
    const reason = prompt("Reason for rejection:");
    if (reason == null) return;
    await reject.mutate(id, reason || "Incomplete requirements").then(() => list.refetch()).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Enrollment & Registration"
        description="Review applications, validate requirements, and approve enrollment for the school year."
      >
        <Badge tone="success" dot>Enrollment open</Badge>
      </PageHeader>

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => setStatus(f.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  status === f.value ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student…" className="pl-10" />
          </div>
        </div>

        <CardContent className="px-0 pb-0">
          {list.loading ? (
            <div className="p-5"><LoadingState rows={6} /></div>
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={list.refetch} className="m-5" />
          ) : rows.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No enrollments found" description="Applications matching this filter will show here." className="m-5" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">Student</th>
                    <th className="px-5 py-2.5 font-medium">Grade & Section</th>
                    <th className="px-5 py-2.5 font-medium">School Year</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.map((e) => (
                    <tr key={e.id} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={studentName(e)} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900">{studentName(e)}</p>
                            <p className="text-xs text-ink-400">{e.student?.lrn ?? `Enrollment #${e.id}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-600">
                        {e.grade_level?.name ?? `Grade #${e.grade_level_id}`}
                        {e.section?.name ? ` · ${e.section.name}` : ""}
                      </td>
                      <td className="px-5 py-3 text-ink-600">
                        {e.school_year ? `${e.school_year.year_start}–${e.school_year.year_end}` : `#${e.school_year_id}`}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={statusTone[e.status] ?? "neutral"} dot>{e.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {e.status === "pending" ? (
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => onApprove(e.id)} disabled={approve.loading}>
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onReject(e.id)} disabled={reject.loading}>
                              <X className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-400">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function studentName(e: Enrollment): string {
  return (
    e.student?.name ||
    `${e.student?.first_name ?? ""} ${e.student?.last_name ?? ""}`.trim() ||
    `Student #${e.student_id}`
  );
}
