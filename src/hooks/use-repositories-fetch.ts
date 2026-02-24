"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { RepoSummary, StatsResponse } from "@/src/lib/types";

export type FetchState = {
  repos: RepoSummary[] | null;
  stats: StatsResponse | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  statsError: string | null;
};

const initialFetchState: FetchState = {
  repos: null,
  stats: null,
  loading: false,
  error: null,
  notFound: false,
  statsError: null,
};

export function useRepositoriesFetch() {
  const [state, setState] = useState<FetchState>(initialFetchState);
  const abortRef = useRef(false);

  const fetchRepositories = useCallback(
    async (listUrl: string, statsUrl: string) => {
      abortRef.current = false;
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        statsError: null,
        notFound: false,
      }));

      try {
        const [listRes, statsRes] = await Promise.all([
          fetch(listUrl),
          fetch(statsUrl),
        ]);

        if (abortRef.current) return;

        if (listRes.status === 404) {
          setState({
            ...initialFetchState,
            error: "Usuário não encontrado.",
            notFound: true,
            loading: false,
          });
          return;
        }

        if (!listRes.ok) {
          setState({
            ...initialFetchState,
            error: "Ocorreu um erro ao buscar os repositórios.",
            loading: false,
          });
          return;
        }

        const repos = (await listRes.json()) as RepoSummary[];

        let stats: StatsResponse | null = null;
        let statsError: string | null = null;

        if (statsRes.ok) {
          stats = (await statsRes.json()) as StatsResponse;
        } else if (statsRes.status === 404) {
          statsError =
            "Não foi possível carregar as estatísticas (usuário não encontrado).";
        } else {
          statsError = "Não foi possível carregar as estatísticas.";
        }

        if (abortRef.current) return;

        setState({
          repos,
          stats,
          loading: false,
          error: null,
          notFound: false,
          statsError,
        });
      } catch (err) {
        if (abortRef.current) return;
        console.error("[frontend] Unexpected error fetching repositories:", err);
        setState({
          ...initialFetchState,
          error: "Erro inesperado ao buscar dados.",
          loading: false,
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setState(initialFetchState);
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, notFound: false }));
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  return {
    ...state,
    fetchRepositories,
    reset,
    setError,
  };
}
