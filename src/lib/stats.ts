import type { GitHubRepo, StatsResponse } from "./types";

export function computeStats(repos: GitHubRepo[]): StatsResponse {
  const total_repositories = repos.length;

  let total_stars = 0;
  const languages: Record<string, number> = {};
  let most_recent_update: string | null = null;

  for (const repo of repos) {
    const stars = repo.stargazers_count ?? 0;
    total_stars += stars;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1;
    }

    if (!most_recent_update || repo.updated_at > most_recent_update) {
      most_recent_update = repo.updated_at;
    }
  }

  return {
    total_repositories,
    total_stars,
    languages,
    most_recent_update,
  };
}

