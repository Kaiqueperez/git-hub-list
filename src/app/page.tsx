"use client";

import { FormEvent, useCallback } from "react";
import type { RepoListQuery } from "@/src/lib/types";
import { useSearchForm, useRepositoriesFetch } from "@/src/hooks";


export default function Home() {
  const form = useSearchForm();
  const {
    repos,
    stats,
    loading,
    error,
    statsError,
    fetchRepositories,
    setError,
  } = useRepositoriesFetch();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedUsername = form.username.trim();
      if (!trimmedUsername) {
        setError("Informe um username do GitHub.");
        return;
      }
      const { listUrl, statsUrl } = form.buildRequestUrls(trimmedUsername);
      await fetchRepositories(listUrl, statsUrl);
    },
    [form.username, form.buildRequestUrls, fetchRepositories, setError]
  );

  const hasResults = !!repos && repos.length > 0;
  const isEmpty = !loading && repos && repos.length === 0 && !error;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-50 flex items-stretch justify-center px-4 py-8 md:py-12 font-mono">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-700/70 bg-slate-900/95 shadow-[0_40px_120px_rgba(15,23,42,0.9)] px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section
          aria-label="Consulta de repositórios GitHub"
          className="flex flex-col gap-5"
        >
          <header className="flex flex-col gap-2">
            <span className="text-[0.7rem] tracking-[0.16em] uppercase text-indigo-300/80">
              Git hub list
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-[0.16em] uppercase text-slate-100">
              Radar de Repositórios GitHub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Digite um <strong>username</strong> do GitHub, ajuste filtros de{" "}
              <code>language</code>, <code>sort</code> e <code>order</code> e
              explore até 20 repositórios com estatísticas em tempo quase real.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            aria-label="Formulário de busca de repositórios"
            className="grid gap-3 items-end sm:grid-cols-2 md:grid-cols-[minmax(0,1.4fr),repeat(3,minmax(0,1fr)),auto]"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="text-[0.7rem] font-medium text-slate-200"
              >
                Username do GitHub
              </label>
              <input
                id="username"
                name="username"
                required
                value={form.username}
                onChange={(event) => form.setUsername(event.target.value)}
                placeholder="ex.: gaearon"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-500/60 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-50 outline-none ring-0 transition focus:border-lime-300 focus:ring-2 focus:ring-lime-300/40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="language"
                className="text-[0.7rem] font-medium text-slate-200"
              >
                Language (opcional)
              </label>
              <input
                id="language"
                name="language"
                value={form.language}
                onChange={(event) => form.setLanguage(event.target.value)}
                placeholder="TypeScript, Go..."
                autoComplete="off"
                className="w-full rounded-xl border border-slate-600/60 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-50 outline-none ring-0 transition focus:border-lime-300/80 focus:ring-2 focus:ring-lime-300/40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="sort"
                className="text-[0.7rem] font-medium text-slate-200"
              >
                Ordenar por:
              </label>
              <select
                id="sort"
                name="Filtrar por:"
                value={form.sort ?? ""}
                onChange={(event) =>
                  form.setSort(
                    event.target.value === ""
                      ? "stars"
                      : (event.target.value as RepoListQuery["sort"])
                  )
                }
                className="w-full rounded-xl border border-slate-600/60 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-50 outline-none ring-0 transition focus:border-lime-300/80 focus:ring-2 focus:ring-lime-300/40"
              >
                <option value="">Selecione</option>
                <option value="stars">Estrelas</option>
                <option value="name">Nome</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="order"
                className="text-[0.7rem] font-medium text-slate-200"
              >
                Ordem de:
              </label>
              <select
                id="order"
                name="Ordem:"
                value={form.order ?? ""}
                onChange={(event) =>
                  form.setOrder(
                    event.target.value === ""
                      ? "desc"
                      : (event.target.value as RepoListQuery["order"])
                  )
                }
                className="w-full rounded-xl border border-slate-600/60 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-50 outline-none ring-0 transition focus:border-lime-300/80 focus:ring-2 focus:ring-lime-300/40"
              >
                <option value="">Selecione</option>
                <option value="desc">Maior para o menor</option>
                <option value="asc">Menor para o maior</option>
              </select>
            </div>

            <button
              type="submit"
              aria-label="Buscar repositórios"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-full border border-lime-200/80 bg-gradient-to-br from-lime-200 via-lime-400 to-emerald-500 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-950 shadow-sm transition hover:brightness-105 disabled:cursor-default disabled:opacity-60"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </form>

          <div
            aria-live="polite"
            role="status"
            className="min-h-[1.5rem] text-xs sm:text-[0.85rem]"
          >
            {error && (
              <span className="inline-flex items-start gap-1.5 text-rose-200">
                <span
                  aria-hidden="true"
                  className="mt-[3px] h-2 w-2 rounded-full bg-rose-500"
                />
                <span>{error}</span>
              </span>
            )}
            {!error && loading && (
              <span className="text-indigo-300">
                Carregando repositórios e estatísticas...
              </span>
            )}
            {isEmpty && (
              <span className="text-slate-400">
                Nenhum repositório encontrado para os filtros informados.
              </span>
            )}
          </div>

          <section
            aria-label="Lista de repositórios"
            className="mt-1 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/95 to-slate-950/95 max-h-80 overflow-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800/90 px-3.5 py-2.5 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <span className="text-[0.8rem] uppercase tracking-[0.14em] text-slate-400">
                Repositórios
              </span>
              <span className="text-[0.75rem] text-slate-500">
                {repos ? `${repos.length} de até 20` : "aguardando busca"}
              </span>
            </div>

            {hasResults && (
              <ul className="flex list-none flex-col gap-2 px-3.5 pb-3.5 pt-1 text-xs sm:text-[0.85rem]">
                {repos!.map((repo) => (
                  <li
                    key={repo.url}
                    className="grid gap-x-3 gap-y-1 rounded-xl border border-slate-800/90 px-3 py-2 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]"
                  >
                    <div className="min-w-0">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-slate-100 no-underline hover:text-lime-200"
                      >
                        <span className="max-w-xs truncate md:max-w-sm">
                          {repo.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-[0.7rem] text-slate-400"
                        >
                          ↗
                        </span>
                      </a>
                      {repo.description && (
                        <p className="mt-0.5 truncate text-[0.78rem] text-slate-400">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-start gap-1.5 text-[0.78rem] text-slate-400 md:justify-end">
                      <span className="rounded-full border border-teal-300/50 bg-teal-900/40 px-2 py-[2px] text-[0.72rem] text-cyan-100">
                        {repo.language ?? "Unknown"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span>★</span>
                        <strong>{repo.stars}</strong>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!hasResults && !loading && (
              <div className="px-3.5 py-3 text-[0.8rem] text-slate-500">
                Nenhum dado carregado ainda. Informe um username e clique em{" "}
                <strong>Buscar</strong>.
              </div>
            )}
          </section>
        </section>

        <section
          aria-label="Estatísticas agregadas do usuário"
          className="mt-1 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-gradient-radial from-emerald-500/15 via-slate-900/95 to-slate-950/95 px-3.5 py-4 sm:px-4"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[0.72rem] uppercase tracking-[0.16em] text-slate-500">
                Stats
              </span>
              <h2 className="text-sm sm:text-base font-semibold text-slate-100">
                Painel do usuário
              </h2>
            </div>
            {stats && (
              <span className="text-[0.75rem] text-lime-300">
                total: {stats.total_repositories} repos
              </span>
            )}
          </header>

          {statsError && (
            <p className="text-xs sm:text-[0.8rem] text-rose-200">
              {statsError}
            </p>
          )}

          {!stats && !loading && (
            <p className="text-xs sm:text-[0.82rem] text-slate-500">
              As estatísticas aparecem aqui depois da primeira busca
              bem-sucedida.
            </p>
          )}

          {loading && (
            <p className="text-xs sm:text-[0.82rem] text-indigo-300">
              Calculando estatísticas...
            </p>
          )}

          {stats && (
            <div className="grid grid-cols-1 gap-3 text-[0.82rem] sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700 px-3 py-2">
                <div className="mb-1 text-[0.75rem] text-slate-400">
                  Total de repositórios
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {stats.total_repositories}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 px-3 py-2">
                <div className="mb-1 text-[0.75rem] text-slate-400">
                  Total de stars
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  ★ {stats.total_stars}
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-slate-700 px-3 py-2">
                <div className="mb-1.5 text-[0.75rem] text-slate-400">
                  Linguagens
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(stats.languages).map(([lang, count]) => (
                    <span
                      key={lang}
                      className="rounded-full border border-slate-600 bg-slate-900/90 px-2.5 py-[3px] text-[0.78rem] text-slate-100"
                    >
                      {lang} · {count}
                    </span>
                  ))}
                  {Object.keys(stats.languages).length === 0 && (
                    <span className="text-[0.78rem] text-slate-500">
                      Nenhuma linguagem identificada.
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-slate-700 px-3 py-2">
                <div className="mb-1 text-[0.75rem] text-slate-400">
                  Última atualização
                </div>
                <div className="text-[0.9rem] text-slate-100">
                  {stats.most_recent_update
                    ? new Date(
                        stats.most_recent_update
                      ).toLocaleString("pt-BR")
                    : "Não disponível"}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}