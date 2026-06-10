"use client";

import { useState } from "react";
import { HeartPulse, Search, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { healthApi } from "@/lib/api/endpoints";
import type { HealthRecord, ID } from "@/lib/api/types";

export default function HealthPage() {
  const [studentId, setStudentId] = useState("");
  const [activeId, setActiveId] = useState<ID | null>(null);
  const [saved, setSaved] = useState(false);

  const record = useQuery(
    () => healthApi.forStudent(activeId as ID),
    [activeId],
    { enabled: activeId != null },
  );
  const upsert = useMutation((p: Partial<HealthRecord>) => healthApi.upsert(activeId as ID, p));

  const r = (record.data?.data ?? {}) as HealthRecord;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (activeId == null) return;
    const fd = new FormData(e.currentTarget);
    await upsert
      .mutate({
        blood_type: String(fd.get("blood_type")),
        height_cm: Number(fd.get("height_cm")) || undefined,
        weight_kg: Number(fd.get("weight_kg")) || undefined,
        allergies: String(fd.get("allergies")),
        medical_conditions: String(fd.get("medical_conditions")),
        emergency_contact_name: String(fd.get("emergency_contact_name")),
        emergency_contact_number: String(fd.get("emergency_contact_number")),
      })
      .then(() => {
        setSaved(true);
        record.refetch();
      })
      .catch(() => {});
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Student Health Records" description="View and update learner health profiles." />

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-end">
          <Field label="Student ID" className="flex-1">
            <div className="flex gap-2">
              <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} type="number" placeholder="Enter student ID" />
              <Button onClick={() => { setActiveId(studentId ? Number(studentId) : null); setSaved(false); }}>
                <Search className="h-4 w-4" />
                Look up
              </Button>
            </div>
          </Field>
        </div>

        <CardContent>
          {activeId == null ? (
            <EmptyState icon={HeartPulse} title="Look up a health record" description="Enter a student ID to view or edit their health profile." />
          ) : record.loading ? (
            <LoadingState rows={4} />
          ) : record.error && record.error.status !== 404 ? (
            <ErrorState error={record.error} onRetry={record.refetch} />
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Blood type"><Input name="blood_type" defaultValue={r.blood_type ?? ""} placeholder="O+" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Height (cm)"><Input name="height_cm" type="number" defaultValue={r.height_cm ?? ""} /></Field>
                <Field label="Weight (kg)"><Input name="weight_kg" type="number" defaultValue={r.weight_kg ?? ""} /></Field>
              </div>
              <Field label="Allergies" className="sm:col-span-2"><Input name="allergies" defaultValue={r.allergies ?? ""} /></Field>
              <Field label="Medical conditions" className="sm:col-span-2"><Input name="medical_conditions" defaultValue={r.medical_conditions ?? ""} /></Field>
              <Field label="Emergency contact name"><Input name="emergency_contact_name" defaultValue={r.emergency_contact_name ?? ""} /></Field>
              <Field label="Emergency contact number"><Input name="emergency_contact_number" defaultValue={r.emergency_contact_number ?? ""} /></Field>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Button type="submit" disabled={upsert.loading}>
                  <Save className="h-4 w-4" />
                  {upsert.loading ? "Saving…" : "Save record"}
                </Button>
                {saved && <span className="text-sm font-medium text-success-600">Saved ✓</span>}
                {upsert.error && <span className="text-sm font-medium text-danger-600">{upsert.error.message}</span>}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
