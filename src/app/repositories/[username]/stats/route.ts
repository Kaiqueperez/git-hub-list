import { getReposForUser, GitHubApiError } from "@/src/lib/github";
import { computeStats } from "@/src/lib/stats";

const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

function isValidUsername(username: string): boolean {
  return GITHUB_USERNAME_PATTERN.test(username.trim());
}

export async function GET(
  _request: Request,
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
    const stats = computeStats(rawRepos);
    return Response.json(stats);
  } catch (err) {
    if (err instanceof GitHubApiError) {
      if (err.status === 404) {
        return Response.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.error(
        "[repositories-stats] GitHub API error:",
        err.status,
        err.body
      );
      return Response.json(
        { error: "Upstream error" },
        { status: 502 }
      );
    }
    console.error("[repositories-stats] Unexpected error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
