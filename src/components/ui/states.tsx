import { AlertTriangle, Inbox, RefreshCw, ServerCrash } from "lucide-react";
import type { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/* Skeleton block for loading placeholders. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-ink-200/70",
        className,
      )}
    />
  );
}

/* Full-card loading state with shimmering rows. */
export function LoadingState({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-ink-100 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/* Error panel with a retry action — shows API/validation/connection issues. */
export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: ApiError | null;
  onRetry?: () => void;
  className?: string;
}) {
  const isConnection = error?.status === 0;
  const Icon = isConnection ? ServerCrash : AlertTriangle;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-danger-500/30 bg-danger-50/50 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 font-display text-base font-semibold text-ink-900">
        {isConnection ? "Couldn't reach the server" : "Something went wrong"}
      </p>
      <p className="mt-1 max-w-md text-sm text-ink-500">
        {error?.message ?? "An unexpected error occurred."}
      </p>
      {isConnection && (
        <p className="mt-1 text-xs text-ink-400">
          Make sure the backend API is running and CORS allows this origin.
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}

/* Empty placeholder when a list returns no rows. */
export function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 font-display text-base font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
