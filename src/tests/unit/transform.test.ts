import {
  toRepoSummary,
  filterByLanguage,
  sortRepos,
  applyListQuery,
} from "@/src/lib/transform";
import type { GitHubRepo, RepoSummary } from "@/src/lib/types";

const sampleRepo: GitHubRepo = {
  name: "foo",
  html_url: "https://github.com/u/foo",
  description: "desc",
  language: "TypeScript",
  stargazers_count: 10,
  updated_at: "2024-01-15T12:00:00Z",
};

describe("toRepoSummary", () => {
  it("mapeia html_url -> url, stargazers_count -> stars, updated_at -> last_update", () => {
    const out = toRepoSummary(sampleRepo);
    expect(out).toEqual({
      name: "foo",
      url: "https://github.com/u/foo",
      description: "desc",
      language: "TypeScript",
      stars: 10,
      last_update: "2024-01-15T12:00:00Z",
    });
  });

  it("converte description e language null para null", () => {
    const repo: GitHubRepo = {
      ...sampleRepo,
      description: null,
      language: null,
    };
    const out = toRepoSummary(repo);
    expect(out.description).toBeNull();
    expect(out.language).toBeNull();
  });
});

describe("filterByLanguage", () => {
  const list: RepoSummary[] = [
    { ...toRepoSummary(sampleRepo), language: "JavaScript" },
    { ...toRepoSummary(sampleRepo), name: "b", language: "TypeScript" },
    { ...toRepoSummary(sampleRepo), name: "c", language: "JavaScript" },
  ];

  it("filtra por linguagem (case-sensitive)", () => {
    const filtered = filterByLanguage(list, "JavaScript");
    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.language === "JavaScript")).toBe(true);
  });

  it("retorna vazio se nenhum match", () => {
    expect(filterByLanguage(list, "Rust")).toHaveLength(0);
  });

  it("retorna todos se language vazia", () => {
    expect(filterByLanguage(list, "")).toHaveLength(3);
  });
});

describe("sortRepos", () => {
  const list: RepoSummary[] = [
    { ...toRepoSummary(sampleRepo), name: "c", stars: 1 },
    { ...toRepoSummary(sampleRepo), name: "a", stars: 10 },
    { ...toRepoSummary(sampleRepo), name: "b", stars: 5 },
  ];

  it("ordena por stars desc por padrão", () => {
    const out = sortRepos(list, "stars", "desc");
    expect(out.map((r) => r.stars)).toEqual([10, 5, 1]);
  });

  it("ordena por stars asc", () => {
    const out = sortRepos(list, "stars", "asc");
    expect(out.map((r) => r.stars)).toEqual([1, 5, 10]);
  });

  it("ordena por name asc", () => {
    const out = sortRepos(list, "name", "asc");
    expect(out.map((r) => r.name)).toEqual(["a", "b", "c"]);
  });

  it("ordena por name desc", () => {
    const out = sortRepos(list, "name", "desc");
    expect(out.map((r) => r.name)).toEqual(["c", "b", "a"]);
  });
});

describe("applyListQuery", () => {
  const raw: GitHubRepo[] = [
    { ...sampleRepo, name: "r1", language: "JS", stargazers_count: 5 },
    { ...sampleRepo, name: "r2", language: "TS", stargazers_count: 10 },
    { ...sampleRepo, name: "r3", language: "JS", stargazers_count: 1 },
  ];

  it("retorna no máximo 20 itens", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      ...sampleRepo,
      name: `r${i}`,
      stargazers_count: i,
    }));
    const out = applyListQuery(many, {});
    expect(out).toHaveLength(20);
  });

  it("aplica filtro language e ordenação", () => {
    const out = applyListQuery(raw, {
      language: "JS",
      sort: "stars",
      order: "asc",
    });
    expect(out).toHaveLength(2);
    expect(out.map((r) => r.name)).toEqual(["r3", "r1"]);
  });
});
