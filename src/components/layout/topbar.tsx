"use client";

import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search students, courses, documents…"
          className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50 pl-10 pr-4 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        <span className="hidden items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-700 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
          Term Active
        </span>

        <button
          className="relative rounded-xl p-2.5 text-ink-500 hover:bg-ink-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 hover:bg-ink-100">
          <Avatar name="Elena Marquez" color="#6366f1" size="sm" />
          <ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
