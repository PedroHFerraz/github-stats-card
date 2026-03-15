export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

export interface UserStats {
  username: string;
  name: string;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  followers: number;
  topLanguages: LanguageStat[];
  memberSince: string;
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export type Theme = "dark" | "light" | "dracula" | "nord" | "sunset";

export interface CardOptions {
  username: string;
  theme?: Theme;
  showLanguages?: boolean;
  showBorder?: boolean;
  borderRadius?: number;
  width?: number;
}
