"use client";

import { useState } from "react";
import { LifeBuoy, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { guidanceApi } from "@/lib/api/endpoints";
import type { GuidanceRecord } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function GuidancePage() {
  const [tab, setTab] = useState<"all" | "followups">("all");
  const list = useQuery(() => (tab === "all" ? guidanceApi.list() : guidanceApi.followUps()), [tab]);
  const create = useMutation(guidanceApi.create);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as GuidanceRecord[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      student_id: Number(fd.get("student_id")),
      session_date: String(fd.get("session_date")),
      concern_type: String(fd.get("concern_type")),
      description: String(fd.get("description")),
      action_taken: String(fd.get("action_taken")),
      follow_up_date: String(fd.get("follow_up_date")) || undefined,
    });
    setOpen(false);
    list.refetch();
  }

  function name(r: GuidanceRecord) {
    return r.student?.name || `${r.student?.first_name ?? ""} ${r.student?.last_name ?? ""}`.trim() || `Student #${r.student_id}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Guidance & Counseling" description="Counseling sessions, referrals, and follow-ups.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New session
        </Button>
      </PageHeader>

      <Card>
        <div className="flex gap-2 border-b border-ink-100 p-3">
          {(["all", "followups"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                tab === t ? "bg-brand-600 text-white" : "text-ink-600 hover:bg-ink-100",
              )}
            >
              {t === "all" ? "All sessions" : "Pending follow-ups"}
            </button>
          ))}
        </div>
        <CardContent className="px-0 pb-0">
          {list.loading ? <div className="p-5"><LoadingState rows={5} /></div> : list.error ? <ErrorState error={list.error} onRetry={list.refetch} className="m-5" /> : rows.length === 0 ? (
            <EmptyState icon={LifeBuoy} title="No records" className="m-5" />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/60">
                  <Avatar name={name(r)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink-900">{name(r)}</p>
                      <Badge tone="accent">{r.concern_type}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500">{r.description}</p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      Session: {r.session_date}
                      {r.follow_up_date ? ` · Follow-up: ${r.follow_up_date}` : ""}
                    </p>
                  </div>
                  {r.status && <Badge tone={r.status === "closed" ? "success" : "info"} dot>{r.status}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New counseling session" size="lg"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="g" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="g" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Student ID" required><Input name="student_id" type="number" required /></Field>
            <Field label="Session date" required><Input name="session_date" type="date" required /></Field>
          </div>
          <Field label="Concern type" required>
            <Select name="concern_type" defaultValue="academic">
              <option value="academic">Academic</option>
              <option value="behavioral">Behavioral</option>
              <option value="personal">Personal</option>
              <option value="family">Family</option>
            </Select>
          </Field>
          <Field label="Description" required><Textarea name="description" rows={2} required /></Field>
          <Field label="Action taken"><Textarea name="action_taken" rows={2} /></Field>
          <Field label="Follow-up date"><Input name="follow_up_date" type="date" /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
