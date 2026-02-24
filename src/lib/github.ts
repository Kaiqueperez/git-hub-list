import type { GitHubRepo } from "./types";
import { getCachedRepos, setCachedRepos } from "./cache";

const GITHUB_API = "https://api.github.com";
const PER_PAGE = 100;

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

/**
 * Chama a GitHub REST API v3 para GET /users/{username}/repos.
 * Usa cache em memória por 60s por username.
 */
export async function getReposForUser(username: string): Promise<GitHubRepo[]> {
  const cached = getCachedRepos(username);
  if (cached) return cached;

  const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=${PER_PAGE}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    if (res.status === 404) {
      throw new GitHubApiError("User not found", 404, body);
    }
    throw new GitHubApiError(
      `GitHub API error: ${res.status}`,
      res.status,
      body
    );
  }

  const data = (await res.json()) as GitHubRepo[];
  const normalized = data.map((repo) => ({
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description ?? null,
    language: repo.language ?? null,
    stargazers_count: repo.stargazers_count ?? 0,
    updated_at: repo.updated_at,
  }));
  setCachedRepos(username, normalized);
  return normalized;
}
