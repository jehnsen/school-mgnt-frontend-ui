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
  Quote,
  Star,
  Bell,
  Award,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import {
  Reveal,
  CountUp,
  TiltCard,
  SpotlightCard,
  RotatingWords,
  ScrollProgress,
} from "@/components/landing/interactive";

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
  { value: 4312, label: "Active students" },
  { value: 286, label: "Faculty members" },
  { value: 98.6, decimals: 1, suffix: "%", label: "Pass rate" },
  { value: 7, label: "Integrated modules" },
];

const marqueeItems = [
  "Enrollment & Registration",
  "Online Grading",
  "Student Advising",
  "Faculty Loading",
  "Document Management",
  "Analytics & Reports",
  "Student Portal",
];

const testimonials = [
  {
    quote:
      "Enrollment that used to take our office a full week now wraps up in an afternoon. The automated evaluation flow alone is worth it.",
    name: "Ma. Teresa Villanueva",
    role: "University Registrar",
  },
  {
    quote:
      "Encoding grades used to eat my weekends. Now I post an entire section in minutes — with zero computation errors.",
    name: "Engr. Paolo Ramos",
    role: "Faculty, College of Engineering",
  },
  {
    quote:
      "My grades, curriculum progress and what to enroll next — all in one place. It honestly feels like a premium app.",
    name: "Alyssa Cruz",
    role: "BS Computer Science, 3rd Year",
  },
];

const navLinks = [
  { href: "#modules", label: "Modules" },
  { href: "#features", label: "Why Akademya360" },
  { href: "#stats", label: "Impact" },
  { href: "#testimonials", label: "Voices" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-ink-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-600 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors hover:text-ink-900 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-brand-500 after:to-accent-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 sm:inline-flex"
            >
              Sign in
            </Link>
            <ButtonLink
              href="/dashboard"
              size="md"
              className="shadow-glow transition-all hover:shadow-pop hover:-translate-y-0.5"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" />
        <div className="animate-blob absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="animate-blob animation-delay-2000 absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-accent-500/20 blur-[120px]" />
        <div className="animate-blob animation-delay-4000 absolute left-1/3 top-1/2 h-[360px] w-[360px] rounded-full bg-info-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="animate-float-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              The complete academic management suite
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h1
              className="animate-float-up mt-6 font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Run your entire campus,
              <br />
              <RotatingWords
                words={["beautifully.", "effortlessly.", "intelligently."]}
                className="animate-gradient-x bg-gradient-to-r from-brand-300 via-accent-400 to-brand-300 bg-clip-text pb-2 text-transparent"
              />
            </h1>
            <p
              className="animate-float-up mx-auto mt-6 max-w-2xl text-lg text-ink-300"
              style={{ animationDelay: "240ms" }}
            >
              Akademya360 unifies enrollment, advising, grading, faculty loading,
              records and analytics into one clean, premium platform — built to make
              student and faculty processes effortlessly efficient.
            </p>
            <div
              className="animate-float-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "360ms" }}
            >
              <ButtonLink
                href="/dashboard"
                size="lg"
                className="w-full shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-pop sm:w-auto"
              >
                Explore the platform
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/portal"
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                View student portal
              </ButtonLink>
            </div>
            <p
              className="animate-float-up mt-6 text-sm text-ink-400"
              style={{ animationDelay: "480ms" }}
            >
              No backend required · Fully responsive · Built with Next.js & Tailwind
            </p>
          </div>

          {/* Floating preview */}
          <div
            className="animate-float-up relative mx-auto mt-16 max-w-5xl pb-20"
            style={{ animationDelay: "600ms" }}
          >
            {/* Glow behind the preview */}
            <div className="absolute inset-x-12 top-8 -z-0 h-2/3 rounded-full bg-brand-600/25 blur-[100px]" />

            {/* Floating notification — enrollment */}
            <div className="animate-float-y absolute -left-6 top-20 z-10 hidden w-60 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-2xl backdrop-blur lg:block">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success-500/15 text-success-500">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Enrollment cleared</p>
                  <p className="text-[11px] text-ink-400">Juan Dela Cruz · BSCS 2A</p>
                </div>
              </div>
            </div>

            {/* Floating notification — grades */}
            <div
              className="animate-float-y-slow absolute -right-4 bottom-40 z-10 hidden w-60 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-2xl backdrop-blur lg:block"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                  <Bell className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Grades posted</p>
                  <p className="text-[11px] text-ink-400">Data Structures · 1st Sem</p>
                </div>
              </div>
            </div>

            {/* Floating icon chips */}
            <div
              className="animate-float-y absolute -top-8 right-16 z-10 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand-300 shadow-xl backdrop-blur lg:flex"
              style={{ animationDelay: "0.8s" }}
            >
              <GraduationCap className="h-6 w-6" />
            </div>
            <div
              className="animate-float-y-slow absolute -left-2 bottom-24 z-10 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent-400 shadow-xl backdrop-blur lg:flex"
              style={{ animationDelay: "2.2s" }}
            >
              <Award className="h-6 w-6" />
            </div>

            <TiltCard>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
                  <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-danger-500/70" />
                    <span className="h-3 w-3 rounded-full bg-warning-500/70" />
                    <span className="h-3 w-3 rounded-full bg-success-500/70" />
                    <span className="ml-3 text-xs text-ink-400">
                      app.akademya360.edu/dashboard
                    </span>
                    <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700">
                      <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-success-500" />
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-6">
                    {[
                      { k: "Total enrolled", v: "4,312", c: "text-brand-600" },
                      { k: "Avg. GWA", v: "1.78", c: "text-accent-600" },
                      { k: "Faculty load", v: "92%", c: "text-success-600" },
                    ].map((s, cardIndex) => (
                      <div
                        key={s.k}
                        className="rounded-xl border border-ink-100 bg-ink-50/50 p-4"
                      >
                        <p className="text-xs text-ink-500">{s.k}</p>
                        <p className={`mt-1 font-display text-2xl font-bold ${s.c}`}>
                          {s.v}
                        </p>
                        <div className="mt-3 flex items-end gap-1">
                          {[40, 65, 50, 80, 70, 95].map((h, i) => (
                            <span
                              key={i}
                              className="animate-bar-grow flex-1 rounded-sm bg-gradient-to-t from-brand-200 to-brand-300"
                              style={{
                                height: `${h * 0.4}px`,
                                animationDelay: `${800 + cardIndex * 150 + i * 80}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative border-t border-white/10 bg-white/[0.02] py-4">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className="mx-6 flex items-center gap-2.5 whitespace-nowrap text-sm font-medium text-ink-400"
                >
                  <GraduationCap className="h-4 w-4 text-brand-400/70" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 sm:px-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="px-4 text-center">
              <p className="font-display text-4xl font-extrabold tracking-tight text-ink-900">
                <CountUp
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix ?? ""}
                />
              </p>
              <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
              <p className="mt-2 text-sm text-ink-500">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
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
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m.title} delay={(i % 3) * 100} className="h-full">
              <SpotlightCard className="h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-pop">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-500/10 text-brand-600 ring-1 ring-brand-100 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <m.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{m.desc}</p>
                <div className="mt-4 flex -translate-x-1 items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Explore module
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-brand-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features split */}
      <section id="features" className="relative overflow-hidden bg-ink-50">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <Reveal x={-32} y={0}>
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
              ].map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={200 + i * 120} y={16} className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-white/70">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-glow">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900">{f.title}</p>
                      <p className="mt-0.5 text-sm text-ink-500">{f.desc}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal x={32} y={0} delay={150}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-transparent to-accent-500/15 blur-2xl" />
              <div className="animate-float-y-slow relative rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold text-ink-900">
                    Enrollment evaluation
                  </p>
                  <span className="flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                    <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-success-500" />
                    Cleared
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    "Prerequisites validated",
                    "Outstanding balance: none",
                    "Curriculum requirements met",
                    "Adviser approval recorded",
                  ].map((item, i) => (
                    <Reveal key={item} delay={300 + i * 150} y={12}>
                      <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 transition-colors hover:bg-brand-50/60">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />
                        <span className="text-sm text-ink-700">{item}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div className="animate-gradient-x mt-5 rounded-xl bg-gradient-to-br from-brand-600 via-accent-600 to-brand-600 p-4 text-white">
                  <p className="text-xs text-white/70">Recommended load</p>
                  <p className="mt-0.5 font-display text-2xl font-bold">
                    21 units · 7 subjects
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Voices from campus
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Loved by registrars, faculty & students
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className="h-full">
              <figure className="group relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-pop">
                <Quote className="h-7 w-7 text-brand-200 transition-colors group-hover:text-brand-400" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                      <p className="text-xs text-ink-500">{t.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5 fill-warning-500 text-warning-500"
                        />
                      ))}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="animate-blob absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="animate-blob animation-delay-2000 absolute right-10 top-0 h-64 w-64 rounded-full bg-accent-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Free to explore — no setup required
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to modernize
              <span className="animate-gradient-x bg-gradient-to-r from-brand-300 via-accent-400 to-brand-300 bg-clip-text text-transparent">
                {" "}your campus?
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300">
              Step into the Akademya360 experience and see how effortless academic
              management can be.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/dashboard"
                size="lg"
                className="w-full shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-pop sm:w-auto"
              >
                Launch dashboard
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/login"
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Sign in to portal
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Wordmark />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
                A modern academic management platform for enrollment, advising,
                grading, faculty loading, records and analytics.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Modules</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
                {modules.slice(0, 4).map((m) => (
                  <li key={m.title}>
                    <a href="#modules" className="transition-colors hover:text-brand-600">
                      {m.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Platform</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-brand-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="transition-colors hover:text-brand-600">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-brand-600">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row">
            <p className="text-sm text-ink-400">
              © 2026 Akademya360. A modern academic management platform.
            </p>
            <p className="text-xs text-ink-400">
              Built with Next.js, Tailwind CSS & care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
