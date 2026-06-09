import Link from "next/link";
import {
  GraduationCap,
  ClipboardCheck,
  BookOpenCheck,
  CalendarRange,
  FileText,
  BarChart3,
  UserCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";

const modules = [
  {
    icon: UserCircle,
    title: "Employee & Student Portal",
    desc: "Secure, single sign-on access to academic and administrative information for every member of the institution.",
  },
  {
    icon: GraduationCap,
    title: "Enrollment & Registration",
    desc: "Automated enrollment with built-in evaluation flows for both regular and irregular students.",
  },
  {
    icon: ClipboardCheck,
    title: "Student Advising",
    desc: "Guide advisees through curriculum requirements and subject selection with real-time prerequisite checks.",
  },
  {
    icon: FileText,
    title: "Registrar's Document Mgmt",
    desc: "Manage academic records, transcripts and official documents with full request lifecycle tracking.",
  },
  {
    icon: BookOpenCheck,
    title: "Online Grading",
    desc: "Accurate, efficient grade computation and retrieval with term-based encoding and posting controls.",
  },
  {
    icon: CalendarRange,
    title: "Faculty Loading",
    desc: "Distribute teaching loads optimally based on institutional policies, ranks and unit limits.",
  },
];

const stats = [
  { value: "4,312", label: "Active students" },
  { value: "286", label: "Faculty members" },
  { value: "98.6%", label: "Pass rate" },
  { value: "7", label: "Integrated modules" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-ink-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-600 md:flex">
            <a href="#modules" className="hover:text-ink-900">Modules</a>
            <a href="#features" className="hover:text-ink-900">Why Akademya360</a>
            <a href="#stats" className="hover:text-ink-900">Impact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 sm:inline-flex"
            >
              Sign in
            </Link>
            <ButtonLink href="/dashboard" size="md">
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-accent-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              The complete academic management suite
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Run your entire campus,
              <span className="bg-gradient-to-r from-brand-300 via-accent-400 to-brand-300 bg-clip-text text-transparent">
                {" "}beautifully.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
              Akademya360 unifies enrollment, advising, grading, faculty loading,
              records and analytics into one clean, premium platform — built to make
              student and faculty processes effortlessly efficient.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/dashboard" size="lg" className="w-full sm:w-auto">
                Explore the platform
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/portal"
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                View student portal
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-400">
              No backend required · Fully responsive · Built with Next.js & Tailwind
            </p>
          </div>

          {/* Floating preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
                <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-danger-500/70" />
                  <span className="h-3 w-3 rounded-full bg-warning-500/70" />
                  <span className="h-3 w-3 rounded-full bg-success-500/70" />
                  <span className="ml-3 text-xs text-ink-400">app.akademya360.edu/dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-6">
                  {[
                    { k: "Total enrolled", v: "4,312", c: "text-brand-600" },
                    { k: "Avg. GWA", v: "1.78", c: "text-accent-600" },
                    { k: "Faculty load", v: "92%", c: "text-success-600" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                      <p className="text-xs text-ink-500">{s.k}</p>
                      <p className={`mt-1 font-display text-2xl font-bold ${s.c}`}>{s.v}</p>
                      <div className="mt-3 flex items-end gap-1">
                        {[40, 65, 50, 80, 70, 95].map((h, i) => (
                          <span
                            key={i}
                            className="flex-1 rounded-sm bg-brand-200"
                            style={{ height: `${h * 0.4}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 py-12 sm:px-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 text-center">
              <p className="font-display text-4xl font-extrabold tracking-tight text-ink-900">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            One platform, seven modules
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Everything academic, in one place
          </h2>
          <p className="mt-4 text-ink-500">
            Each module is purpose-built to streamline a core institutional process —
            and they all work together seamlessly.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.title}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-500/10 text-brand-600 ring-1 ring-brand-100">
                <m.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                {m.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{m.desc}</p>
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-brand-50 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* Features split */}
      <section id="features" className="bg-ink-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Why Akademya360
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Built for efficiency, designed for people
            </h2>
            <p className="mt-4 text-ink-500">
              From data analysis that surfaces institutional trends to a grading
              engine that eliminates manual computation — every detail is engineered
              to save time and reduce errors.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: Zap,
                  title: "Automated workflows",
                  desc: "Enrollment evaluations, grade computation and faculty loading run with minimal manual input.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure role-based access",
                  desc: "Students, faculty, advisers and the registrar each see exactly what they need.",
                },
                {
                  icon: BarChart3,
                  title: "Actionable analytics",
                  desc: "Track academic performance and institutional trends through clean, readable reports.",
                },
              ].map((f) => (
                <li key={f.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{f.title}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-ink-900">Enrollment evaluation</p>
                <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                  Cleared
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Prerequisites validated",
                  "Outstanding balance: none",
                  "Curriculum requirements met",
                  "Adviser approval recorded",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-success-500" />
                    <span className="text-sm text-ink-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
                <p className="text-xs text-white/70">Recommended load</p>
                <p className="mt-0.5 font-display text-2xl font-bold">21 units · 7 subjects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to modernize your campus?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300">
            Step into the Akademya360 experience and see how effortless academic
            management can be.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" size="lg" className="w-full sm:w-auto">
              Launch dashboard
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/login"
              size="lg"
              variant="outline"
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Sign in to portal
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <Wordmark />
          <p className="text-sm text-ink-400">
            © 2026 Akademya360. A modern academic management platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
