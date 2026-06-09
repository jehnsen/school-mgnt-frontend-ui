"use client";

import { useState } from "react";
import { CalendarRange, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { calendarApi } from "@/lib/api/endpoints";
import type { CalendarEvent } from "@/lib/api/types";
import { useAuth } from "@/lib/auth";

const typeTone: Record<string, "brand" | "warning" | "info" | "success" | "neutral" | "danger"> = {
  holiday: "warning",
  exam: "danger",
  school_event: "brand",
  deadline: "info",
};

export default function CalendarPage() {
  const { hasRole } = useAuth();
  const canManage = hasRole("superadmin", "admin", "principal", "registrar");
  const list = useQuery(() => calendarApi.list(), []);
  const create = useMutation(calendarApi.create);
  const remove = useMutation(calendarApi.remove);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as CalendarEvent[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      school_year_id: Number(fd.get("school_year_id")) || 1,
      event_name: String(fd.get("event_name")),
      event_type: String(fd.get("event_type")),
      date: String(fd.get("date")),
      description: String(fd.get("description")),
    });
    setOpen(false);
    list.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Calendar" description="Holidays, exams, deadlines, and school events.">
        {canManage && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          {list.loading ? (
            <LoadingState rows={5} />
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={list.refetch} />
          ) : rows.length === 0 ? (
            <EmptyState icon={CalendarRange} title="No events scheduled" />
          ) : (
            <ul className="space-y-2">
              {rows.map((ev) => (
                <li key={ev.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-3.5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <span className="font-display text-sm font-bold">{ev.date?.slice(8, 10)}</span>
                    <span className="text-[9px] uppercase">{monthAbbr(ev.date)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">{ev.event_name}</p>
                    <p className="truncate text-xs text-ink-400">{ev.description ?? ev.date}</p>
                  </div>
                  <Badge tone={typeTone[ev.event_type] ?? "neutral"}>
                    {String(ev.event_type).replace("_", " ")}
                  </Badge>
                  {canManage && (
                    <button
                      onClick={() => remove.mutate(ev.id).then(() => list.refetch()).catch(() => {})}
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add calendar event"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="evt" disabled={create.loading}>{create.loading ? "Saving…" : "Save"}</Button>
          </>
        }
      >
        <form id="evt" onSubmit={handleCreate} className="space-y-4">
          <Field label="Event name" required><Input name="event_name" required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required><Input name="date" type="date" required /></Field>
            <Field label="Type" required>
              <Select name="event_type" defaultValue="school_event">
                <option value="school_event">School Event</option>
                <option value="holiday">Holiday</option>
                <option value="exam">Exam</option>
                <option value="deadline">Deadline</option>
              </Select>
            </Field>
          </div>
          <Field label="School year ID"><Input name="school_year_id" type="number" defaultValue={1} /></Field>
          <Field label="Description"><Textarea name="description" rows={2} /></Field>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}

function monthAbbr(date?: string) {
  if (!date) return "";
  const m = Number(date.slice(5, 7));
  return ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m] ?? "";
}
