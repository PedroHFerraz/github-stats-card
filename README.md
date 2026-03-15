# 📊 github-stats-card

Generate beautiful SVG cards with your GitHub profile stats. Use them in your README, portfolio, or anywhere that renders images.

<p align="center">
  <img src="assets/preview-dark.svg" width="420" alt="Dark theme preview"/>
</p>

## Features

- **5 themes** — Dark, Light, Dracula, Nord, Sunset
- **Top languages** — auto-detected from your repos
- **Zero dependencies** — just TypeScript + the GitHub API
- **Animated** — subtle fade-in animations on load
- **CLI included** — generate cards from the terminal

## Quick Start

```bash
# clone the repo
git clone https://github.com/YOUR_USERNAME/github-stats-card.git
cd github-stats-card

# install deps
npm install

# generate a card
npx ts-node src/cli.ts torvalds --theme dracula
```

This creates `torvalds-stats.svg` in the current directory.

## Usage

### CLI

```bash
npx ts-node src/cli.ts <username> [options]
```

| Option | Description | Default |
|---|---|---|
| `--theme <name>` | `dark` `light` `dracula` `nord` `sunset` | `dark` |
| `--no-langs` | Hide the languages bar | — |
| `--no-border` | Remove the card border | — |
| `--width <px>` | Card width in pixels | `420` |
| `--output <file>` | Output file path | `<username>-stats.svg` |

### As a module

```typescript
import { fetchUserStats, renderCard } from "./src";

const stats = await fetchUserStats("torvalds");
const svg = renderCard(stats, {
  username: "torvalds",
  theme: "nord",
  showLanguages: true,
});

// svg is a string — write it to a file, serve it, embed it, etc.
```

### In your README

After generating your card, add it to your repo and reference it:

```markdown
![My GitHub Stats](./my-stats.svg)
```

## Themes

<table>
  <tr>
    <td align="center"><strong>Dark</strong><br/><img src="assets/preview-dark.svg" width="380"/></td>
    <td align="center"><strong>Light</strong><br/><img src="assets/preview-light.svg" width="380"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Dracula</strong><br/><img src="assets/preview-dracula.svg" width="380"/></td>
    <td align="center"><strong>Nord</strong><br/><img src="assets/preview-nord.svg" width="380"/></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><strong>Sunset</strong><br/><img src="assets/preview-sunset.svg" width="380"/></td>
  </tr>
</table>

## Rate Limits

The GitHub API allows 60 requests/hour without auth. For higher limits, create a [personal access token](https://github.com/settings/tokens) (no scopes needed) and set it:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

## Project Structure

```
src/
├── card.ts       # SVG renderer
├── cli.ts        # CLI entry point
├── fetcher.ts    # GitHub API client
├── index.ts      # Public exports
├── preview.ts    # Preview generator
├── themes.ts     # Theme definitions + language colors
└── types.ts      # TypeScript types
```

## License

MIT
