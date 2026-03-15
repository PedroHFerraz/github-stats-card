import { writeFileSync } from "fs";
import { renderCard } from "./card";
import { UserStats, Theme } from "./types";

// Sample data for preview (no API needed)
const sampleStats: UserStats = {
  username: "octocat",
  name: "The Octocat",
  totalStars: 1247,
  totalForks: 389,
  totalRepos: 42,
  followers: 8930,
  topLanguages: [
    { name: "TypeScript", count: 15, percentage: 36, color: "#3178c6" },
    { name: "Python", count: 10, percentage: 24, color: "#3572A5" },
    { name: "Rust", count: 7, percentage: 17, color: "#dea584" },
    { name: "Go", count: 5, percentage: 12, color: "#00ADD8" },
    { name: "Shell", count: 5, percentage: 12, color: "#89e051" },
  ],
  memberSince: "2011",
};

const allThemes: Theme[] = ["dark", "light", "dracula", "nord", "sunset"];

for (const theme of allThemes) {
  const svg = renderCard(sampleStats, {
    username: "octocat",
    theme,
    showLanguages: true,
    showBorder: true,
  });

  writeFileSync(`assets/preview-${theme}.svg`, svg, "utf-8");
  console.log(`  ✅ Generated preview-${theme}.svg`);
}

console.log("\n  Done! Check the assets/ folder.\n");
