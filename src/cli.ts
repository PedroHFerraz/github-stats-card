import { writeFileSync } from "fs";
import { fetchUserStats } from "./fetcher";
import { renderCard } from "./card";
import { Theme } from "./types";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
  📊 github-stats-card

  Generate beautiful SVG cards with your GitHub profile stats.

  Usage:
    npx ts-node src/cli.ts <username> [options]

  Options:
    --theme <name>     Theme: dark, light, dracula, nord, sunset (default: dark)
    --no-langs         Hide the languages section
    --no-border        Hide the card border
    --width <number>   Card width in pixels (default: 420)
    --output <file>    Output file path (default: <username>-stats.svg)

  Examples:
    npx ts-node src/cli.ts torvalds
    npx ts-node src/cli.ts torvalds --theme dracula
    npx ts-node src/cli.ts torvalds --theme nord --no-langs --output card.svg
    `);
    process.exit(0);
  }

  const username = args[0];
  const theme = (getArg(args, "--theme") || "dark") as Theme;
  const showLanguages = !args.includes("--no-langs");
  const showBorder = !args.includes("--no-border");
  const width = parseInt(getArg(args, "--width") || "420", 10);
  const output = getArg(args, "--output") || `${username}-stats.svg`;

  console.log(`\n  ⏳ Fetching stats for @${username}...\n`);

  try {
    const stats = await fetchUserStats(username);

    console.log(`  ✅ ${stats.name}`);
    console.log(`     ⭐ ${stats.totalStars} stars · 🍴 ${stats.totalForks} forks · 📦 ${stats.totalRepos} repos`);
    console.log(`     👥 ${stats.followers} followers`);

    if (stats.topLanguages.length > 0) {
      const langs = stats.topLanguages.map((l) => `${l.name} (${l.percentage}%)`).join(", ");
      console.log(`     💻 ${langs}`);
    }

    const svg = renderCard(stats, {
      username,
      theme,
      showLanguages,
      showBorder,
      width,
    });

    writeFileSync(output, svg, "utf-8");
    console.log(`\n  📄 Card saved to ${output}\n`);
  } catch (err) {
    console.error(`\n  ❌ ${(err as Error).message}\n`);
    process.exit(1);
  }
}

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

main();
