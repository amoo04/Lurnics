import { useCallback, useEffect, useState } from "react";
import { apiGet, ApiError } from "./api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiGet<T>(path: string | null) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !!path, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    apiGet<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof ApiError ? err.message : "Something went wrong",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, refetch };
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
