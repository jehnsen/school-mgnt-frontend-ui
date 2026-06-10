"use client";

import { useState } from "react";
import { UserPlus, Search, Users as UsersIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useQuery, useMutation } from "@/hooks/use-query";
import { usersApi } from "@/lib/api/endpoints";
import type { Role, User } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const ROLES: Role[] = ["super_admin", "admin", "principal", "registrar", "teacher", "student", "parent", "cashier", "guidance"];
type Tone = "brand" | "accent" | "info" | "success" | "warning" | "neutral" | "danger";
const roleTone: Record<string, Tone> = {
  super_admin: "danger",
  admin: "brand",
  teacher: "accent",
  student: "info",
  parent: "success",
};

export default function UsersPage() {
  const [role, setRole] = useState<string>("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(
    () => usersApi.list({ role: role || undefined, per_page: 50 }),
    [role],
  );
  const create = useMutation(usersApi.create);
  const remove = useMutation(usersApi.remove);

  const rows = (data?.data ?? []).filter(
    (u) =>
      u.name?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const first = String(fd.get("first_name") ?? "");
    const last = String(fd.get("last_name") ?? "");
    await create.mutate({
      name: `${first} ${last}`.trim(),
      first_name: first,
      last_name: last,
      email: String(fd.get("email") ?? ""),
      role: fd.get("role") as Role,
      password: String(fd.get("password") ?? ""),
      password_confirmation: String(fd.get("password") ?? ""),
      contact_number: String(fd.get("contact_number") ?? ""),
      gender: String(fd.get("gender") ?? "") || undefined,
    });
    setOpen(false);
    refetch();
  }

  async function handleDelete(u: User) {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    await remove.mutate(u.id).then(refetch).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage accounts and roles across the institution.">
        <Button onClick={() => setOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add user
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-10"
            />
          </div>
          <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-48">
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>

        <CardContent className="px-0 pb-0">
          {loading ? (
            <div className="p-5"><LoadingState rows={6} /></div>
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} className="m-5" />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description="Try a different filter, or add a new user."
              className="m-5"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-2.5 font-medium">User</th>
                    <th className="px-5 py-2.5 font-medium">Role</th>
                    <th className="px-5 py-2.5 font-medium">Contact</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.map((u) => (
                    <tr key={u.id} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900">{u.name}</p>
                            <p className="text-xs text-ink-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={roleTone[u.role] ?? "neutral"}>{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-600">{u.profile?.contact_number ?? u.contact_number ?? "—"}</td>
                      <td className="px-5 py-3">
                        <Badge tone={u.is_active === false ? "neutral" : "success"} dot>
                          {u.is_active === false ? "Inactive" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(u)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-danger-50 hover:text-danger-500"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add user"
        description="Create a new account and assign a role."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="create-user" disabled={create.loading}>
              {create.loading ? "Saving…" : "Create user"}
            </Button>
          </>
        }
      >
        <form id="create-user" onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" required>
            <Input name="first_name" required />
          </Field>
          <Field label="Last name" required>
            <Input name="last_name" required />
          </Field>
          <Field label="Email" required className="sm:col-span-2">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Role" required>
            <Select name="role" required defaultValue="teacher">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Gender">
            <Select name="gender" defaultValue="">
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </Field>
          <Field label="Contact number">
            <Input name="contact_number" />
          </Field>
          <Field label="Password" required>
            <Input name="password" type="password" required minLength={6} />
          </Field>
          {create.error && (
            <p className={cn("sm:col-span-2 text-sm text-danger-600")}>
              {create.error.message}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
