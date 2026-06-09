"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "faculty", label: "Faculty", icon: Users },
  { id: "admin", label: "Registrar", icon: ShieldCheck },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("faculty");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left — brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-ink-950 lg:block">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-500/20 blur-[120px]" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Wordmark href="/" invert />
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white">
              Welcome back to your
              <span className="bg-gradient-to-r from-brand-300 to-accent-400 bg-clip-text text-transparent">
                {" "}academic command center.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-ink-300">
              Enrollment, advising, grading, faculty loading, records and analytics —
              all in one premium, unified platform.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "4,312", l: "Students" },
                { v: "286", l: "Faculty" },
                { v: "98.6%", l: "Pass rate" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-ink-500">© 2026 Akademya360</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex w-full items-center justify-center px-5 py-12 sm:px-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Wordmark href="/" />
          </div>

          <div className="mt-8 lg:mt-0">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">
              Sign in to your account
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              Select your role and enter your credentials to continue.
            </p>
          </div>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-all",
                    active
                      ? "border-brand-400 bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                      : "border-ink-200 text-ink-500 hover:border-ink-300 hover:bg-ink-50",
                  )}
                >
                  <r.icon className="h-5 w-5" />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/dashboard");
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  defaultValue="e.marquez@akademya.edu"
                  className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="you@akademya.edu"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-ink-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  defaultValue="password"
                  className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-10 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              Keep me signed in
            </label>

            <Button type="submit" size="lg" className="w-full">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Need help accessing your account?{" "}
            <Link href="/dashboard" className="font-medium text-brand-600 hover:text-brand-700">
              Contact the registrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
