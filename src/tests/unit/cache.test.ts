import {
  getCachedRepos,
  setCachedRepos,
  clearCache,
} from "@/src/lib/cache";
import type { GitHubRepo } from "@/src/lib/types";

const sample: GitHubRepo[] = [
  {
    name: "a",
    html_url: "https://github.com/u/a",
    description: null,
    language: "TS",
    stargazers_count: 1,
    updated_at: "2024-01-01T00:00:00Z",
  },
];

beforeEach(() => {
  clearCache();
});

describe("cache", () => {
  it("retorna null em miss", () => {
    expect(getCachedRepos("unknown")).toBeNull();
  });

  it("retorna dados em hit após set", () => {
    setCachedRepos("user1", sample);
    expect(getCachedRepos("user1")).toEqual(sample);
  });

  it("cache é case-insensitive por username", () => {
    setCachedRepos("User1", sample);
    expect(getCachedRepos("user1")).toEqual(sample);
    expect(getCachedRepos("USER1")).toEqual(sample);
  });

  it("expira após TTL (60s)", () => {
    jest.useFakeTimers();
    setCachedRepos("user1", sample);
    expect(getCachedRepos("user1")).not.toBeNull();
    jest.advanceTimersByTime(61 * 1000);
    expect(getCachedRepos("user1")).toBeNull();
    jest.useRealTimers();
  });

  it("clearCache(username) remove só esse usuário", () => {
    setCachedRepos("u1", sample);
    setCachedRepos("u2", sample);
    clearCache("u1");
    expect(getCachedRepos("u1")).toBeNull();
    expect(getCachedRepos("u2")).toEqual(sample);
  });

  it("clearCache() remove todos", () => {
    setCachedRepos("u1", sample);
    setCachedRepos("u2", sample);
    clearCache();
    expect(getCachedRepos("u1")).toBeNull();
    expect(getCachedRepos("u2")).toBeNull();
  });
});
