"use client";

import { useState } from "react";
import { ShieldAlert, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { disciplineApi } from "@/lib/api/endpoints";
import type { DisciplineRecord } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function DisciplinePage() {
  const [severity, setSeverity] = useState("");
  const list = useQuery(() => disciplineApi.list({ severity: severity || undefined }), [severity]);
  const create = useMutation(disciplineApi.create);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as DisciplineRecord[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      student_id: Number(fd.get("student_id")),
      incident_date: String(fd.get("incident_date")),
      incident_type: String(fd.get("incident_type")),
      severity: String(fd.get("severity")) as DisciplineRecord["severity"],
      description: String(fd.get("description")),
    });
    setOpen(false);
    list.refetch();
  }

  function studentName(r: DisciplineRecord) {
    return r.student?.name || `${r.student?.first_name ?? ""} ${r.student?.last_name ?? ""}`.trim() || `Student #${r.student_id}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Conduct & Discipline" description="Record and track student incidents and interventions.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New record
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap gap-2 border-b border-ink-100 p-4">
          {[
            { label: "All", value: "" },
            { label: "Minor", value: "minor" },
            { label: "Major", value: "major" },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setSeverity(f.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                severity === f.value ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <CardContent className="px-0 pb-0">
          {list.loading ? <div className="p-5"><LoadingState rows={5} /></div> : list.error ? <ErrorState error={list.error} onRetry={list.refetch} className="m-5" /> : rows.length === 0 ? (
            <EmptyState icon={ShieldAlert} title="No discipline records" className="m-5" />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/60">
                  <Avatar name={studentName(r)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink-900">{studentName(r)}</p>
                      <Badge tone={r.severity === "major" ? "danger" : "warning"}>{r.severity}</Badge>
                      <Badge tone="neutral">{r.incident_type}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500">{r.description}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{r.incident_date}</p>
                  </div>
                  <Badge tone={r.status === "resolved" ? "success" : "info"} dot>{r.status ?? "open"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New discipline record" size="lg"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="disc" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="disc" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Student ID" required><Input name="student_id" type="number" required /></Field>
            <Field label="Incident date" required><Input name="incident_date" type="date" required /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Incident type" required><Input name="incident_type" placeholder="tardiness" required /></Field>
            <Field label="Severity" required>
              <Select name="severity" defaultValue="minor">
                <option value="minor">Minor</option>
                <option value="major">Major</option>
              </Select>
            </Field>
          </div>
          <Field label="Description" required><Textarea name="description" rows={3} required /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
