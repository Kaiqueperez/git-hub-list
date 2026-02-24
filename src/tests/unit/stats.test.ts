import { computeStats } from "@/src/lib/stats";
import type { GitHubRepo } from "@/src/lib/types";

const baseRepo: GitHubRepo = {
  name: "repo",
  html_url: "https://github.com/u/repo",
  description: "Desc",
  language: "TypeScript",
  stargazers_count: 10,
  updated_at: "2024-01-01T10:00:00Z",
};

describe("computeStats", () => {
  it("calcula total_repositories como tamanho do array", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, name: "a" },
      { ...baseRepo, name: "b" },
      { ...baseRepo, name: "c" },
    ];
    const stats = computeStats(repos);
    expect(stats.total_repositories).toBe(3);
  });

  it("soma corretamente total_stars", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, name: "a", stargazers_count: 1 },
      { ...baseRepo, name: "b", stargazers_count: 5 },
      { ...baseRepo, name: "c", stargazers_count: 10 },
    ];
    const stats = computeStats(repos);
    expect(stats.total_stars).toBe(16);
  });

  it("conta linguagens ignorando null", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, name: "a", language: "JavaScript" },
      { ...baseRepo, name: "b", language: "TypeScript" },
      { ...baseRepo, name: "c", language: "JavaScript" },
      { ...baseRepo, name: "d", language: null },
    ];
    const stats = computeStats(repos);
    expect(stats.languages).toEqual({
      JavaScript: 2,
      TypeScript: 1,
    });
    expect(stats.languages).not.toHaveProperty("null");
  });

  it("calcula corretamente most_recent_update com múltiplas datas", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, name: "a", updated_at: "2024-01-01T10:00:00Z" },
      { ...baseRepo, name: "b", updated_at: "2024-03-01T10:00:00Z" },
      { ...baseRepo, name: "c", updated_at: "2024-02-01T10:00:00Z" },
    ];
    const stats = computeStats(repos);
    expect(stats.most_recent_update).toBe("2024-03-01T10:00:00Z");
  });

  it("retorna zeros e mapa vazio para lista vazia", () => {
    const stats = computeStats([]);
    expect(stats.total_repositories).toBe(0);
    expect(stats.total_stars).toBe(0);
    expect(stats.languages).toEqual({});
    expect(stats.most_recent_update).toBeNull();
  });
}
);

