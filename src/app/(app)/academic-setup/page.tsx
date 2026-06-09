"use client";

import { useState } from "react";
import { Plus, CalendarDays, Layers, Grid3x3, BookText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { academicApi } from "@/lib/api/endpoints";
import type { ApiError } from "@/lib/api/client";
import type { GradeLevel, Section, SchoolYear, Subject } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ListQuery<T> {
  data: { data: T[] } | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

type Tab = "years" | "levels" | "sections" | "subjects";

const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: "years", label: "School Years", icon: CalendarDays },
  { id: "levels", label: "Grade Levels", icon: Layers },
  { id: "sections", label: "Sections", icon: Grid3x3 },
  { id: "subjects", label: "Subjects", icon: BookText },
];

export default function AcademicSetupPage() {
  const [tab, setTab] = useState<Tab>("years");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Setup"
        description="Configure school years, grade levels, sections, and subjects."
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-brand-400 bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                : "border-ink-200 bg-white text-ink-600 hover:border-ink-300",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "years" && <SchoolYearsTab />}
      {tab === "levels" && <GradeLevelsTab />}
      {tab === "sections" && <SectionsTab />}
      {tab === "subjects" && <SubjectsTab />}
    </div>
  );
}

/* ----------------------------- shared shell ---------------------------- */

function TabShell<T>({
  query,
  columns,
  row,
  onAdd,
  emptyLabel,
}: {
  query: ListQuery<T>;
  columns: string[];
  row: (item: T) => React.ReactNode;
  onAdd: () => void;
  emptyLabel: string;
}) {
  const rows = query.data?.data ?? [];
  return (
    <Card>
      <div className="flex items-center justify-end border-b border-ink-100 p-3">
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <CardContent className="px-0 pb-0">
        {query.loading ? (
          <div className="p-5"><LoadingState rows={5} /></div>
        ) : query.error ? (
          <ErrorState error={query.error} onRetry={query.refetch} className="m-5" />
        ) : rows.length === 0 ? (
          <EmptyState title={emptyLabel} className="m-5" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                  {columns.map((c) => (
                    <th key={c} className="px-5 py-2.5 font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">{rows.map(row)}</tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ----------------------------- school years ---------------------------- */

function SchoolYearsTab() {
  const query = useQuery(() => academicApi.schoolYears.list(), []);
  const create = useMutation(academicApi.schoolYears.create);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      year_start: Number(fd.get("year_start")),
      year_end: Number(fd.get("year_end")),
      status: String(fd.get("status")) as "active" | "inactive",
    });
    setOpen(false);
    query.refetch();
  }

  return (
    <>
      <TabShell<SchoolYear>
        query={query}
        columns={["School Year", "Status"]}
        emptyLabel="No school years yet"
        onAdd={() => setOpen(true)}
        row={(y) => (
          <tr key={y.id} className="hover:bg-ink-50/60">
            <td className="px-5 py-3 font-medium text-ink-900">
              {y.year_start}–{y.year_end}
            </td>
            <td className="px-5 py-3">
              <Badge tone={y.status === "active" ? "success" : "neutral"} dot>{y.status}</Badge>
            </td>
          </tr>
        )}
      />
      <FormModal open={open} onClose={() => setOpen(false)} title="Add school year" loading={create.loading} error={create.error?.message} formId="sy" onSubmit={submit}>
        <Field label="Year start" required><Input name="year_start" type="number" defaultValue={2025} required /></Field>
        <Field label="Year end" required><Input name="year_end" type="number" defaultValue={2026} required /></Field>
        <Field label="Status"><Select name="status" defaultValue="active"><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
      </FormModal>
    </>
  );
}

/* ----------------------------- grade levels ---------------------------- */

function GradeLevelsTab() {
  const query = useQuery(() => academicApi.gradeLevels.list(), []);
  const create = useMutation(academicApi.gradeLevels.create);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      name: String(fd.get("name")),
      education_level: String(fd.get("education_level")) as GradeLevel["education_level"],
    });
    setOpen(false);
    query.refetch();
  }

  return (
    <>
      <TabShell<GradeLevel>
        query={query}
        columns={["Grade Level", "Education Level"]}
        emptyLabel="No grade levels yet"
        onAdd={() => setOpen(true)}
        row={(g) => (
          <tr key={g.id} className="hover:bg-ink-50/60">
            <td className="px-5 py-3 font-medium text-ink-900">{g.name}</td>
            <td className="px-5 py-3"><Badge tone="brand">{String(g.education_level).replace("_", " ")}</Badge></td>
          </tr>
        )}
      />
      <FormModal open={open} onClose={() => setOpen(false)} title="Add grade level" loading={create.loading} error={create.error?.message} formId="gl" onSubmit={submit}>
        <Field label="Name" required><Input name="name" placeholder="Grade 7" required /></Field>
        <Field label="Education level" required>
          <Select name="education_level" defaultValue="junior_high">
            <option value="elementary">Elementary</option>
            <option value="junior_high">Junior High</option>
            <option value="senior_high">Senior High</option>
          </Select>
        </Field>
      </FormModal>
    </>
  );
}

/* ------------------------------- sections ------------------------------ */

function SectionsTab() {
  const query = useQuery(() => academicApi.sections.list(), []);
  const levels = useQuery(() => academicApi.gradeLevels.list(), []);
  const create = useMutation(academicApi.sections.create);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      name: String(fd.get("name")),
      grade_level_id: Number(fd.get("grade_level_id")),
      capacity: Number(fd.get("capacity")),
    });
    setOpen(false);
    query.refetch();
  }

  return (
    <>
      <TabShell<Section>
        query={query}
        columns={["Section", "Grade Level", "Capacity"]}
        emptyLabel="No sections yet"
        onAdd={() => setOpen(true)}
        row={(s) => (
          <tr key={s.id} className="hover:bg-ink-50/60">
            <td className="px-5 py-3 font-medium text-ink-900">{s.name}</td>
            <td className="px-5 py-3 text-ink-600">{s.grade_level?.name ?? `#${s.grade_level_id}`}</td>
            <td className="px-5 py-3 text-ink-600">{s.capacity}</td>
          </tr>
        )}
      />
      <FormModal open={open} onClose={() => setOpen(false)} title="Add section" loading={create.loading} error={create.error?.message} formId="sec" onSubmit={submit}>
        <Field label="Name" required><Input name="name" placeholder="Rizal" required /></Field>
        <Field label="Grade level" required>
          <Select name="grade_level_id" required defaultValue="">
            <option value="" disabled>Select grade level</option>
            {(levels.data?.data ?? []).map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Capacity" required><Input name="capacity" type="number" defaultValue={40} required /></Field>
      </FormModal>
    </>
  );
}

/* ------------------------------- subjects ------------------------------ */

function SubjectsTab() {
  const query = useQuery(() => academicApi.subjects.list(), []);
  const create = useMutation(academicApi.subjects.create);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({ name: String(fd.get("name")), code: String(fd.get("code")) });
    setOpen(false);
    query.refetch();
  }

  return (
    <>
      <TabShell<Subject>
        query={query}
        columns={["Code", "Subject"]}
        emptyLabel="No subjects yet"
        onAdd={() => setOpen(true)}
        row={(s) => (
          <tr key={s.id} className="hover:bg-ink-50/60">
            <td className="px-5 py-3 font-medium text-ink-900">{s.code}</td>
            <td className="px-5 py-3 text-ink-600">{s.name}</td>
          </tr>
        )}
      />
      <FormModal open={open} onClose={() => setOpen(false)} title="Add subject" loading={create.loading} error={create.error?.message} formId="subj" onSubmit={submit}>
        <Field label="Subject name" required><Input name="name" placeholder="Mathematics" required /></Field>
        <Field label="Code" required><Input name="code" placeholder="MATH101" required /></Field>
      </FormModal>
    </>
  );
}

/* ----------------------------- form modal ------------------------------ */

function FormModal({
  open,
  onClose,
  title,
  formId,
  onSubmit,
  loading,
  error,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  formId: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-4">
        {children}
        {error && <p className="text-sm text-danger-600">{error}</p>}
      </form>
    </Modal>
  );
}
