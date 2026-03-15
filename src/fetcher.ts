import { GitHubUser, GitHubRepo, UserStats, LanguageStat } from "./types";
import { languageColors } from "./themes";

const API_BASE = "https://api.github.com";

async function fetchJSON<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    "User-Agent": "github-stats-card",
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("Rate limited by GitHub API. Set GITHUB_TOKEN env var to increase limits.");
    }
    if (res.status === 404) {
      throw new Error("GitHub user not found.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchUserStats(username: string): Promise<UserStats> {
  const user = await fetchJSON<GitHubUser>(`${API_BASE}/users/${username}`);

  // Fetch all repos (paginated, up to 300)
  const repos: GitHubRepo[] = [];
  let page = 1;
  while (page <= 3) {
    const batch = await fetchJSON<GitHubRepo[]>(
      `${API_BASE}/users/${username}/repos?per_page=100&page=${page}&type=owner`
    );
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }

  const ownRepos = repos.filter((r) => !r.fork);

  // Aggregate stats
  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

  // Count languages
  const langMap = new Map<string, number>();
  for (const repo of ownRepos) {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
    }
  }

  const totalWithLang = Array.from(langMap.values()).reduce((a, b) => a + b, 0);

  const topLanguages: LanguageStat[] = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalWithLang) * 100),
      color: languageColors[name] || languageColors.default,
    }));

  const memberSince = new Date(user.created_at).getFullYear().toString();

  return {
    username: user.login,
    name: user.name || user.login,
    totalStars,
    totalForks,
    totalRepos: ownRepos.length,
    followers: user.followers,
    topLanguages,
    memberSince,
  };
}
