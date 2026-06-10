"use client";

import { useState } from "react";
import { LifeBuoy, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { iepApi } from "@/lib/api/endpoints";
import type { IEP } from "@/lib/api/types";

const statusTone: Record<string, "info" | "success" | "warning" | "neutral"> = {
  active: "info",
  completed: "success",
  draft: "neutral",
  under_review: "warning",
};

function num(v: unknown) {
  return typeof v === "number" ? v.toLocaleString() : "—";
}

export default function IEPPage() {
  const list = useQuery(() => iepApi.list(), []);
  const stats = useQuery(() => iepApi.statistics(), []);
  const create = useMutation(iepApi.create);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as IEP[];
  const s = (stats.data?.data ?? {}) as Record<string, unknown>;

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      student_id: Number(fd.get("student_id")),
      school_year_id: Number(fd.get("school_year_id")) || 1,
      disability_type: String(fd.get("disability_type")),
      accommodations: String(fd.get("accommodations")),
      goals: String(fd.get("goals")),
    });
    setOpen(false);
    list.refetch();
  }

  function name(r: IEP) {
    return r.student?.name || `${r.student?.first_name ?? ""} ${r.student?.last_name ?? ""}`.trim() || `Student #${r.student_id}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="IEP / SPED Tracking" description="Individualized Education Programs for learners with special needs.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New IEP
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total IEPs" value={num(s.total ?? s.total_ieps ?? rows.length)} icon={Users} tone="brand" />
        <StatCard label="Active" value={num(s.active ?? s.active_ieps)} icon={LifeBuoy} tone="info" />
        <StatCard label="Under review" value={num(s.under_review ?? s.pending)} icon={LifeBuoy} tone="warning" />
      </div>

      <Card>
        <CardContent className="px-0 pb-0 pt-0">
          {list.loading ? <div className="p-5"><LoadingState rows={5} /></div> : list.error ? <ErrorState error={list.error} onRetry={list.refetch} className="m-5" /> : rows.length === 0 ? (
            <EmptyState icon={LifeBuoy} title="No IEP records" className="m-5" />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/60">
                  <Avatar name={name(r)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink-900">{name(r)}</p>
                      <Badge tone="accent">{String(r.disability_type).replace(/_/g, " ")}</Badge>
                    </div>
                    {r.accommodations && <p className="mt-0.5 text-sm text-ink-500">{r.accommodations}</p>}
                    {r.review_date && <p className="mt-0.5 text-xs text-ink-400">Review: {r.review_date}</p>}
                  </div>
                  {r.status && <Badge tone={statusTone[r.status] ?? "neutral"} dot>{String(r.status).replace(/_/g, " ")}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New IEP record" size="lg"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="iep" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="iep" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Student ID" required><Input name="student_id" type="number" required /></Field>
            <Field label="School year ID"><Input name="school_year_id" type="number" defaultValue={1} /></Field>
          </div>
          <Field label="Disability type" required>
            <Select name="disability_type" defaultValue="learning_disability">
              <option value="learning_disability">Learning Disability</option>
              <option value="adhd">ADHD</option>
              <option value="autism_spectrum">Autism Spectrum</option>
              <option value="hearing_impairment">Hearing Impairment</option>
              <option value="visual_impairment">Visual Impairment</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Accommodations"><Textarea name="accommodations" rows={2} placeholder="Extended test time, oral exams…" /></Field>
          <Field label="Goals"><Textarea name="goals" rows={2} /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
