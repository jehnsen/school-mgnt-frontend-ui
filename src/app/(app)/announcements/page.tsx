"use client";

import { useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { announcementsApi } from "@/lib/api/endpoints";
import type { Announcement } from "@/lib/api/types";

export default function AnnouncementsPage() {
  const list = useQuery(() => announcementsApi.list(), []);
  const create = useMutation(announcementsApi.create);
  const remove = useMutation(announcementsApi.remove);
  const [open, setOpen] = useState(false);

  const rows = (list.data?.data ?? []) as Announcement[];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await create.mutate({
      title: String(fd.get("title")),
      body: String(fd.get("body")),
      audience: String(fd.get("audience")),
      is_published: fd.get("is_published") === "on",
    });
    setOpen(false);
    list.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Broadcast updates to students, parents, and staff.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New announcement
        </Button>
      </PageHeader>

      {list.loading ? (
        <LoadingState rows={4} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : rows.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet" description="Posted announcements will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand">{a.audience}</Badge>
                  <Badge tone={a.is_published ? "success" : "neutral"} dot>
                    {a.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <button
                  onClick={() => remove.mutate(a.id).then(() => list.refetch()).catch(() => {})}
                  className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-500"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{a.body}</p>
              {a.created_at && <p className="mt-3 text-xs text-ink-400">{a.created_at.slice(0, 10)}</p>}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New announcement"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="ann" disabled={create.loading}>
              {create.loading ? "Posting…" : "Post"}
            </Button>
          </>
        }
      >
        <form id="ann" onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required><Input name="title" required /></Field>
          <Field label="Body" required><Textarea name="body" rows={4} required /></Field>
          <Field label="Audience" required>
            <Select name="audience" defaultValue="all">
              <option value="all">Everyone</option>
              <option value="student">Students</option>
              <option value="parent">Parents</option>
              <option value="teacher">Teachers</option>
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
            Publish immediately
          </label>
          {create.error && <p className="text-sm text-danger-600">{create.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
