import type { GitHubRepo, RepoSummary, RepoListQuery } from "./types";

const MAX_ITEMS = 20;

/**
 * Normaliza um item do GitHub para o formato RepoSummary.
 * Mapeia: html_url -> url, stargazers_count -> stars, updated_at -> last_update.
 */
export function toRepoSummary(repo: GitHubRepo): RepoSummary {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? null,
    language: repo.language ?? null,
    stars: repo.stargazers_count,
    last_update: repo.updated_at,
  };
}

/**
 * Filtra por linguagem (case-sensitive conforme tech spec).
 */
export function filterByLanguage(
  repos: RepoSummary[],
  language: string
): RepoSummary[] {
  if (!language) return repos;
  return repos.filter((r) => r.language === language);
}

/**
 * Ordena por nome ou stars, asc/desc.
 */
export function sortRepos(
  repos: RepoSummary[],
  sort: "stars" | "name" = "stars",
  order: "asc" | "desc" = "desc"
): RepoSummary[] {
  const mult = order === "asc" ? 1 : -1;
  return [...repos].sort((a, b) => {
    if (sort === "name") {
      return mult * (a.name.localeCompare(b.name, "en"));
    }
    return mult * (a.stars - b.stars);
  });
}

/**
 * Pipeline: normaliza, filtra por language, ordena, limita a MAX_ITEMS.
 */
export function applyListQuery(
  rawRepos: GitHubRepo[],
  query: RepoListQuery
): RepoSummary[] {
  let list = rawRepos.map(toRepoSummary);
  if (query.language) {
    list = filterByLanguage(list, query.language);
  }
  const sort = query.sort ?? "stars";
  const order = query.order ?? "desc";
  list = sortRepos(list, sort, order);
  return list.slice(0, MAX_ITEMS);
}
