"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("superadmin@school.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError("Cannot reach the API. Make sure the backend is running.");
        } else if (err.status === 401 || err.status === 422) {
          setError("Invalid email or password.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

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
              Enrollment, grading, attendance, finance, and DepEd reporting —
              for the whole K-12 institution in one platform.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "K-12", l: "Grade levels" },
                { v: "DepEd", l: "Compliant forms" },
                { v: "5", l: "User roles" },
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
              Enter your credentials to access the school management system.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger-500/30 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="you@school.com"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-ink-700">Password</label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Trouble signing in?{" "}
            <Link href="/" className="font-medium text-brand-600 hover:text-brand-700">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
