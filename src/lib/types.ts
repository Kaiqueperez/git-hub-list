/**
 * Query params para listagem de repositórios (filtro/ordenação).
 */
export type RepoListQuery = {
  language?: string;
  sort?: "stars" | "name";
  order?: "asc" | "desc";
};

/**
 * Formato de saída da API (lista de repos).
 */
export type RepoSummary = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  last_update: string;
};

export type StatsResponse = {
  total_repositories: number;
  total_stars: number;
  languages: Record<string, number>;
  most_recent_update: string | null;
};

/**
 * Subset do payload do GitHub para um repositório (campos usados).
 */
export type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

export interface GitHubRepositoryService {
  getReposForUser(username: string): Promise<GitHubRepo[]>;
}
