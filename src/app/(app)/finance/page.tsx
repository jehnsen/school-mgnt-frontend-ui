"use client";

import { useState } from "react";
import { Wallet, Plus, Tag, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { feesApi } from "@/lib/api/endpoints";
import type { Discount, FeeStructure } from "@/lib/api/types";
import { cn, formatCurrency } from "@/lib/utils";

export default function FinancePage() {
  const structures = useQuery(() => feesApi.structures.list(), []);
  const discounts = useQuery(() => feesApi.discounts.list(), []);
  const summary = useQuery(() => feesApi.summary(), []);
  const createStructure = useMutation(feesApi.structures.create);
  const createDiscount = useMutation(feesApi.discounts.create);
  const [feeOpen, setFeeOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);

  const feeRows = (structures.data?.data ?? []) as FeeStructure[];
  const discountRows = (discounts.data?.data ?? []) as Discount[];
  const s = (summary.data ?? {}) as Record<string, unknown>;

  async function submitFee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createStructure.mutate({
      school_year_id: Number(fd.get("school_year_id")) || 1,
      grade_level_id: Number(fd.get("grade_level_id")) || undefined,
      fee_type: String(fd.get("fee_type")),
      name: String(fd.get("name")),
      amount: Number(fd.get("amount")),
      description: String(fd.get("description")),
    });
    setFeeOpen(false);
    structures.refetch();
  }

  async function submitDiscount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createDiscount.mutate({
      name: String(fd.get("name")),
      value_type: String(fd.get("value_type")) as Discount["value_type"],
      value: Number(fd.get("value")),
      description: String(fd.get("description")),
    });
    setDiscountOpen(false);
    discounts.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fees & Payments" description="Manage fee structures, discounts, and collections.">
        <Button variant="outline" onClick={() => setDiscountOpen(true)}>
          <Tag className="h-4 w-4" />
          Add discount
        </Button>
        <Button onClick={() => setFeeOpen(true)}>
          <Plus className="h-4 w-4" />
          Add fee
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Wallet} label="Total assessed" value={money(s.total_assessed ?? s.total_fees)} tone="bg-brand-50 text-brand-600" />
        <Stat icon={TrendingUp} label="Total collected" value={money(s.total_collected ?? s.total_paid)} tone="bg-success-50 text-success-600" />
        <Stat icon={Wallet} label="Outstanding" value={money(s.total_outstanding ?? s.balance)} tone="bg-warning-50 text-warning-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fee structures */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Fee Structures</CardTitle>
              <CardDescription>Configured fees per grade level</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {structures.loading ? <div className="p-5"><LoadingState rows={5} /></div> : structures.error ? <ErrorState error={structures.error} onRetry={structures.refetch} className="m-5" /> : feeRows.length === 0 ? (
              <EmptyState icon={Wallet} title="No fee structures" className="m-5" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                      <th className="px-5 py-2.5 font-medium">Fee</th>
                      <th className="px-5 py-2.5 font-medium">Type</th>
                      <th className="px-5 py-2.5 font-medium">Grade</th>
                      <th className="px-5 py-2.5 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {feeRows.map((f) => (
                      <tr key={f.id} className="hover:bg-ink-50/60">
                        <td className="px-5 py-3 font-medium text-ink-900">{f.name}</td>
                        <td className="px-5 py-3"><Badge tone="brand">{f.fee_type}</Badge></td>
                        <td className="px-5 py-3 text-ink-600">{f.grade_level?.name ?? (f.grade_level_id ? `#${f.grade_level_id}` : "All")}</td>
                        <td className="px-5 py-3 text-right font-semibold text-ink-900">{formatCurrency(f.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discounts */}
        <Card>
          <CardHeader>
            <CardTitle>Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            {discounts.loading ? <LoadingState rows={3} /> : discounts.error ? <ErrorState error={discounts.error} onRetry={discounts.refetch} /> : discountRows.length === 0 ? (
              <EmptyState icon={Tag} title="No discounts" />
            ) : (
              <div className="space-y-2">
                {discountRows.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-ink-800">{d.name}</p>
                      <p className="text-xs text-ink-400">{d.description}</p>
                    </div>
                    <Badge tone="accent">
                      {d.value_type === "percentage" ? `${d.value}%` : formatCurrency(d.value)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Modal open={feeOpen} onClose={() => setFeeOpen(false)} title="Add fee structure" size="lg"
        footer={<><Button variant="outline" onClick={() => setFeeOpen(false)}>Cancel</Button><Button type="submit" form="fee" disabled={createStructure.loading}>{createStructure.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="fee" onSubmit={submitFee} className="grid grid-cols-2 gap-4">
          <Field label="Name" required className="col-span-2"><Input name="name" placeholder="Tuition Fee" required /></Field>
          <Field label="Fee type" required>
            <Select name="fee_type" defaultValue="tuition">
              <option value="tuition">Tuition</option>
              <option value="miscellaneous">Miscellaneous</option>
              <option value="laboratory">Laboratory</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Amount" required><Input name="amount" type="number" step="0.01" required /></Field>
          <Field label="School year ID"><Input name="school_year_id" type="number" defaultValue={1} /></Field>
          <Field label="Grade level ID"><Input name="grade_level_id" type="number" /></Field>
          <Field label="Description" className="col-span-2"><Textarea name="description" rows={2} /></Field>
          {createStructure.error && <p className="col-span-2 text-sm text-danger-600">{createStructure.error.message}</p>}
        </form>
      </Modal>

      <Modal open={discountOpen} onClose={() => setDiscountOpen(false)} title="Add discount" size="lg"
        footer={<><Button variant="outline" onClick={() => setDiscountOpen(false)}>Cancel</Button><Button type="submit" form="disc" disabled={createDiscount.loading}>{createDiscount.loading ? "Saving…" : "Save"}</Button></>}>
        <form id="disc" onSubmit={submitDiscount} className="space-y-4">
          <Field label="Name" required><Input name="name" placeholder="Sibling Discount" required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Value type" required>
              <Select name="value_type" defaultValue="percentage">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </Select>
            </Field>
            <Field label="Value" required><Input name="value" type="number" step="0.01" required /></Field>
          </div>
          <Field label="Description"><Textarea name="description" rows={2} /></Field>
          {createDiscount.error && <p className="text-sm text-danger-600">{createDiscount.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}

function money(v: unknown) {
  return typeof v === "number" ? formatCurrency(v) : "—";
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Wallet; label: string; value: string; tone: string }) {
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
