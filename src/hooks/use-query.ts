"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";

interface QueryState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

/**
 * Minimal data-fetching hook for client components (no external deps).
 * Re-runs whenever any value in `deps` changes.
 */
export function useQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true;
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    loading: enabled,
  });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(
    (signal: AbortSignal) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      fetcherRef.current(signal)
        .then((data) => {
          if (!signal.aborted) setState({ data, error: null, loading: false });
        })
        .catch((err) => {
          if (signal.aborted) return;
          const apiErr =
            err instanceof ApiError ? err : new ApiError(0, String(err?.message ?? err));
          setState({ data: null, error: apiErr, loading: false });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [nonce, setNonce] = useState(0);
  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, error: null, loading: false });
      return;
    }
    const controller = new AbortController();
    run(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, nonce, ...deps]);

  return { ...state, refetch };
}

interface MutationState {
  loading: boolean;
  error: ApiError | null;
}

/** Imperative mutation helper with loading/error tracking. */
export function useMutation<TArgs extends unknown[], TResult>(
  mutator: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<MutationState>({ loading: false, error: null });
  const mutatorRef = useRef(mutator);
  mutatorRef.current = mutator;

  const mutate = useCallback(async (...args: TArgs): Promise<TResult> => {
    setState({ loading: true, error: null });
    try {
      const result = await mutatorRef.current(...args);
      setState({ loading: false, error: null });
      return result;
    } catch (err) {
      const apiErr =
        err instanceof ApiError ? err : new ApiError(0, String((err as Error)?.message ?? err));
      setState({ loading: false, error: apiErr });
      throw apiErr;
    }
  }, []);

  return { mutate, ...state };
}
