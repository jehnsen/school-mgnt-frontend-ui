"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles, X } from "lucide-react";
import { navForRole } from "@/lib/nav";
import { useAuth } from "@/lib/auth";
import { Wordmark } from "@/components/brand";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Administrator",
  principal: "Principal",
  registrar: "Registrar",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent / Guardian",
  cashier: "Cashier",
  guidance: "Guidance",
};

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const sections = navForRole(user?.role);
  const roleLabel = user ? ROLE_LABELS[user.role] ?? user.role : "";

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "no-print fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-200/70 bg-white transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Wordmark href="/dashboard" />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                            : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            active
                              ? "text-white"
                              : "text-ink-400 group-hover:text-ink-600",
                          )}
                          strokeWidth={2}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              active
                                ? "bg-white/20 text-white"
                                : "bg-success-50 text-success-600",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Upgrade card */}
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
            <Sparkles className="absolute -right-2 -top-2 h-16 w-16 text-white/10" />
            <p className="text-sm font-semibold">SY 2025–2026</p>
            <p className="mt-0.5 text-xs text-white/70">
              2nd Semester · Enrollment ongoing
            </p>
            <Link
              href="/enrollment"
              className="mt-3 inline-flex items-center rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"
            >
              Manage term
            </Link>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-ink-200/70 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink-100">
            <Avatar name={user?.name ?? "User"} color="#6366f1" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {user?.name ?? "—"}
              </p>
              <p className="truncate text-xs text-ink-400">{roleLabel}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-200 hover:text-ink-700"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
