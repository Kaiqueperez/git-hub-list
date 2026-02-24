import type { GitHubRepo } from "./types";

const TTL_MS = 60 * 1000; 

type Entry = {
  data: GitHubRepo[];
  expiresAt: number;
};

const store = new Map<string, Entry>();

/**
 * Cache em memória por username com TTL de 60 segundos.
 */
export function getCachedRepos(username: string): GitHubRepo[] | null {
  const key = username.toLowerCase();
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Armazena a lista de repos do usuário no cache por 60s.
 */
export function setCachedRepos(username: string, data: GitHubRepo[]): void {
  const key = username.toLowerCase();
  store.set(key, {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
}

/**
 * Remove entrada do cache (útil para testes).
 */
export function clearCache(username?: string): void {
  if (username) {
    store.delete(username.toLowerCase());
  } else {
    store.clear();
  }
}
