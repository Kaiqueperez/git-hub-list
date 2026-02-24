"use client";

import { useState, useCallback } from "react";
import type { RepoListQuery } from "@/src/lib/types";

export type SearchFormState = {
  username: string;
  language: string;
  sort: RepoListQuery["sort"];
  order: RepoListQuery["order"];
};

const defaultSort: RepoListQuery["sort"] = "stars";
const defaultOrder: RepoListQuery["order"] = "desc";

export function useSearchForm(initial?: Partial<SearchFormState>) {
  const [username, setUsername] = useState(initial?.username ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "");
  const [sort, setSort] = useState<RepoListQuery["sort"]>(
    initial?.sort ?? defaultSort
  );
  const [order, setOrder] = useState<RepoListQuery["order"]>(
    initial?.order ?? defaultOrder
  );

  const buildRequestUrls = useCallback(
    (trimmedUsername: string): { listUrl: string; statsUrl: string } => {
      const basePath = `/repositories/${trimmedUsername}`;
      const params = new URLSearchParams();
      if (language.trim()) params.set("language", language.trim());
      if (sort) params.set("sort", sort);
      if (order) params.set("order", order);
      const listUrl = params.toString() ? `${basePath}?${params}` : basePath;
      const statsUrl = `${basePath}/stats`;
      return { listUrl, statsUrl };
    },
    [language, sort, order]
  );

  return {
    username,
    setUsername,
    language,
    setLanguage,
    sort,
    setSort,
    order,
    setOrder,
    buildRequestUrls,
  };
}
