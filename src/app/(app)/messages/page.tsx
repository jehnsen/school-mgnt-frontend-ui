"use client";

import { useState } from "react";
import { Inbox, Send, PenSquare, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { messagesApi } from "@/lib/api/endpoints";
import type { Message } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [box, setBox] = useState<"inbox" | "sent">("inbox");
  const [open, setOpen] = useState(false);
  const list = useQuery(() => (box === "inbox" ? messagesApi.inbox() : messagesApi.sent()), [box]);
  const send = useMutation(messagesApi.send);

  const rows = (list.data?.data ?? []) as Message[];

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await send.mutate({
      receiver_id: Number(fd.get("receiver_id")),
      subject: String(fd.get("subject")),
      body: String(fd.get("body")),
    });
    setOpen(false);
    if (box === "sent") list.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Communicate with teachers, parents, and staff.">
        <Button onClick={() => setOpen(true)}>
          <PenSquare className="h-4 w-4" />
          Compose
        </Button>
      </PageHeader>

      <Card>
        <div className="flex gap-2 border-b border-ink-100 p-3">
          {(["inbox", "sent"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBox(b)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors",
                box === b ? "bg-brand-600 text-white" : "text-ink-600 hover:bg-ink-100",
              )}
            >
              {b === "inbox" ? <Inbox className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {b}
            </button>
          ))}
        </div>
        <CardContent className="px-0 pb-0">
          {list.loading ? (
            <div className="p-5"><LoadingState rows={5} /></div>
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={list.refetch} className="m-5" />
          ) : rows.length === 0 ? (
            <EmptyState icon={Mail} title={`No ${box} messages`} className="m-5" />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((m) => {
                const who = box === "inbox" ? m.sender : m.receiver;
                const name = who?.name ?? `User #${box === "inbox" ? m.sender_id : m.receiver_id}`;
                return (
                  <li key={m.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/60">
                    <Avatar name={name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-ink-900">{name}</p>
                        <span className="shrink-0 text-xs text-ink-400">{m.created_at?.slice(0, 10) ?? ""}</span>
                      </div>
                      <p className="truncate text-sm font-medium text-ink-700">{m.subject}</p>
                      <p className="truncate text-xs text-ink-500">{m.body}</p>
                    </div>
                    {box === "inbox" && !m.is_read && <Badge tone="brand">New</Badge>}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Compose message"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="compose" disabled={send.loading}>
              {send.loading ? "Sending…" : "Send"}
            </Button>
          </>
        }
      >
        <form id="compose" onSubmit={handleSend} className="space-y-4">
          <Field label="Recipient user ID" required hint="Enter the recipient's user ID">
            <Input name="receiver_id" type="number" required />
          </Field>
          <Field label="Subject" required>
            <Input name="subject" required />
          </Field>
          <Field label="Message" required>
            <Textarea name="body" rows={5} required />
          </Field>
          {send.error && <p className="text-sm text-danger-600">{send.error.message}</p>}
        </form>
      </Modal>
    </div>
  );
}
