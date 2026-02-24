import { getReposForUser, GitHubApiError } from "@/src/lib/github";
import { applyListQuery } from "@/src/lib/transform";
import type { RepoListQuery } from "@/src/lib/types";

const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

function isValidUsername(username: string): boolean {
  return GITHUB_USERNAME_PATTERN.test(username.trim());
}

function parseQuery(request: Request): RepoListQuery {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") ?? undefined;
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  return {
    language,
    sort: sort === "stars" || sort === "name" ? sort : undefined,
    order: order === "asc" || order === "desc" ? order : undefined,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || !isValidUsername(username)) {
    return Response.json(
      { error: "Invalid or missing username" },
      { status: 400 }
    );
  }

  try {
    const rawRepos = await getReposForUser(username);
    const query = parseQuery(request);
    const list = applyListQuery(rawRepos, query);
    return Response.json(list);
  } catch (err) {
    if (err instanceof GitHubApiError) {
      if (err.status === 404) {
        return Response.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.error(
        "[repositories-list] GitHub API error:",
        err.status,
        err.body
      );
      return Response.json(
        { error: "Upstream error" },
        { status: 502 }
      );
    }
    console.error("[repositories-list] Unexpected error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
