"use client";

import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { learningRecoveryApi } from "@/lib/api/endpoints";
import type { LearningRecoveryPlan } from "@/lib/api/types";

const statusTone: Record<string, "info" | "success" | "warning" | "neutral"> = {
  active: "info",
  completed: "success",
  pending: "warning",
};

export default function LearningRecoveryPage() {
  const list = useQuery(() => learningRecoveryApi.list(), []);
  const create = useMutation(learningRecoveryApi.create);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as LearningRecoveryPlan[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      student_id: Number(fd.get("student_id")),
      subject_id: Number(fd.get("subject_id")),
      school_year_id: Number(fd.get("school_year_id")) || 1,
      plan_description: String(fd.get("plan_description")),
      target_grade: Number(fd.get("target_grade")) || undefined,
    });
    setOpen(false);
    list.refetch();
  }

  function name(r: LearningRecoveryPlan) {
    return r.student?.name || `${r.student?.first_name ?? ""} ${r.student?.last_name ?? ""}`.trim() || `Student #${r.student_id}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Learning Recovery Plans" description="Remediation plans and interventions for at-risk learners.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </PageHeader>

      {list.loading ? (
        <LoadingState rows={4} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : rows.length === 0 ? (
        <EmptyState icon={Sparkles} title="No recovery plans" description="Create remediation plans for struggling students." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={name(r)} size="sm" />
                  <div>
                    <p className="font-semibold text-ink-900">{name(r)}</p>
                    <p className="text-xs text-ink-400">{r.subject?.name ?? `Subject #${r.subject_id}`}</p>
                  </div>
                </div>
                {r.status && <Badge tone={statusTone[r.status] ?? "neutral"} dot>{r.status}</Badge>}
              </div>
              <p className="mt-3 text-sm text-ink-600">{r.plan_description}</p>
              {r.target_grade != null && (
                <p className="mt-2 text-xs text-ink-400">Target grade: <span className="font-medium text-ink-700">{r.target_grade}</span></p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New learning recovery plan" size="lg"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="lr" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="lr" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Student ID" required><Input name="student_id" type="number" required /></Field>
            <Field label="Subject ID" required><Input name="subject_id" type="number" required /></Field>
            <Field label="Target grade"><Input name="target_grade" type="number" defaultValue={80} /></Field>
          </div>
          <Field label="School year ID"><Input name="school_year_id" type="number" defaultValue={1} /></Field>
          <Field label="Plan description" required><Textarea name="plan_description" rows={3} required /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
