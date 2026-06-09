"use client";

import { useState } from "react";
import { ReceiptText, Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { invoicesApi } from "@/lib/api/endpoints";
import type { ID, Invoice } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  unpaid: "warning",
  overdue: "danger",
};

export default function InvoicesPage() {
  const [enrollmentId, setEnrollmentId] = useState("");
  const [activeId, setActiveId] = useState<ID | null>(null);
  const [open, setOpen] = useState(false);

  const list = useQuery(
    () => invoicesApi.forEnrollment(activeId as ID),
    [activeId],
    { enabled: activeId != null },
  );
  const generate = useMutation(invoicesApi.generate);
  const updateStatus = useMutation((id: ID, status: string) => invoicesApi.updateStatus(id, status));

  const rows = (list.data?.data ?? []) as Invoice[];

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await generate.mutate({
      enrollment_id: Number(fd.get("enrollment_id")),
      due_date: String(fd.get("due_date")),
      notes: String(fd.get("notes")),
    });
    setOpen(false);
    if (activeId != null) list.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Generate and track student invoices by enrollment.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Generate invoice
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-end">
          <Field label="Enrollment ID" className="flex-1">
            <div className="flex gap-2">
              <Input
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                type="number"
                placeholder="Enter enrollment ID to look up invoices"
              />
              <Button onClick={() => setActiveId(enrollmentId ? Number(enrollmentId) : null)}>
                <Search className="h-4 w-4" />
                Look up
              </Button>
            </div>
          </Field>
        </div>

        <CardContent className="px-0 pb-0">
          {activeId == null ? (
            <EmptyState icon={ReceiptText} title="Look up invoices" description="Enter an enrollment ID above to view its invoices." className="m-5" />
          ) : list.loading ? (
            <div className="p-5"><LoadingState rows={4} /></div>
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={list.refetch} className="m-5" />
          ) : rows.length === 0 ? (
            <EmptyState icon={ReceiptText} title="No invoices for this enrollment" className="m-5" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">Invoice</th>
                    <th className="px-5 py-2.5 font-medium">Due date</th>
                    <th className="px-5 py-2.5 font-medium">Amount</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.map((inv) => (
                    <tr key={inv.id} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-mono text-xs text-ink-600">{inv.invoice_number ?? `#${inv.id}`}</td>
                      <td className="px-5 py-3 text-ink-600">{inv.due_date ?? "—"}</td>
                      <td className="px-5 py-3 font-medium text-ink-900">{inv.total_amount != null ? formatCurrency(inv.total_amount) : "—"}</td>
                      <td className="px-5 py-3"><Badge tone={statusTone[inv.status] ?? "neutral"} dot>{inv.status}</Badge></td>
                      <td className="px-5 py-3 text-right">
                        {inv.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate(inv.id, "paid").then(() => list.refetch()).catch(() => {})}>
                            Mark paid
                          </Button>
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

      <Modal open={open} onClose={() => setOpen(false)} title="Generate invoice"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" form="inv" disabled={generate.loading}>{generate.loading ? "Generating…" : "Generate"}</Button></>}>
        <form id="inv" onSubmit={handleGenerate} className="space-y-4">
          <Field label="Enrollment ID" required><Input name="enrollment_id" type="number" required /></Field>
          <Field label="Due date" required><Input name="due_date" type="date" required /></Field>
          <Field label="Notes"><Textarea name="notes" rows={2} /></Field>
          {generate.error && <p className="text-sm text-danger-600">{generate.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
