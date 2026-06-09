"use client";

import { useState } from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { scholarshipsApi } from "@/lib/api/endpoints";
import type { Scholarship } from "@/lib/api/types";

export default function ScholarshipsPage() {
  const list = useQuery(() => scholarshipsApi.list(), []);
  const create = useMutation(scholarshipsApi.create);
  const remove = useMutation(scholarshipsApi.remove);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as Scholarship[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      name: String(fd.get("name")),
      description: String(fd.get("description")),
      type: String(fd.get("type")) as Scholarship["type"],
      discount_percentage: Number(fd.get("discount_percentage")) || undefined,
      sponsored_by: String(fd.get("sponsored_by")),
      is_active: true,
    });
    setOpen(false);
    list.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Scholarships" description="Manage scholarship programs and grants.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New scholarship
        </Button>
      </PageHeader>

      {list.loading ? (
        <LoadingState rows={4} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : rows.length === 0 ? (
        <EmptyState icon={Award} title="No scholarships yet" description="Create scholarship programs to award to students." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((sch) => (
            <Card key={sch.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={sch.is_active ? "success" : "neutral"} dot>{sch.is_active ? "Active" : "Inactive"}</Badge>
                  <button
                    onClick={() => remove.mutate(sch.id).then(() => list.refetch()).catch(() => {})}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-500"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{sch.name}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-500">{sch.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="text-xs text-ink-400">{sch.sponsored_by ?? "—"}</span>
                <Badge tone="brand">
                  {sch.type === "percentage" ? `${sch.discount_percentage ?? 0}% off` : "Fixed grant"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New scholarship" size="lg"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="sch" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="sch" onSubmit={handleCreate} className="space-y-4">
          <Field label="Name" required><Input name="name" placeholder="Academic Excellence Award" required /></Field>
          <Field label="Description"><Textarea name="description" rows={2} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type" required>
              <Select name="type" defaultValue="percentage">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </Select>
            </Field>
            <Field label="Discount %"><Input name="discount_percentage" type="number" min={0} max={100} defaultValue={50} /></Field>
          </div>
          <Field label="Sponsored by"><Input name="sponsored_by" placeholder="School Foundation" /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
