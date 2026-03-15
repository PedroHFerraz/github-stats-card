import { UserStats, CardOptions, Theme } from "./types";
import { themes, ThemeColors } from "./themes";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function iconStar(): string {
  return `<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="currentColor"/>`;
}

function iconFork(): string {
  return `<path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="currentColor"/>`;
}

function iconRepo(): string {
  return `<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" fill="currentColor"/>`;
}

function iconPeople(): string {
  return `<path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 4.6 8.049 3.5 3.5 0 0 1 2 5.5ZM5.5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.5.5a2.5 2.5 0 1 1 4.927.87A4.503 4.503 0 0 1 16 11.5a.75.75 0 0 1-1.5 0 3.001 3.001 0 0 0-2.64-2.977.75.75 0 0 1-.16-1.46A1 1 0 1 0 11 6.5a.75.75 0 0 1-.75-.75c0-.69.56-1.25 1.25-1.25Z" fill="currentColor"/>`;
}

function renderStatItem(
  x: number,
  y: number,
  icon: string,
  label: string,
  value: string | number,
  colors: ThemeColors
): string {
  return `
    <g transform="translate(${x}, ${y})">
      <g transform="translate(0, -6)">
        <svg width="16" height="16" viewBox="0 0 16 16" color="${colors.icon}">
          ${icon}
        </svg>
      </g>
      <text x="22" y="0" font-size="13" fill="${colors.textSecondary}" font-family="'Segoe UI', Ubuntu, sans-serif">${escapeXml(label)}</text>
      <text x="22" y="20" font-size="18" fill="${colors.text}" font-weight="700" font-family="'Segoe UI', Ubuntu, sans-serif">${typeof value === "number" ? value.toLocaleString() : escapeXml(value)}</text>
    </g>
  `;
}

function renderLanguageBar(
  stats: UserStats,
  y: number,
  width: number,
  colors: ThemeColors
): string {
  if (stats.topLanguages.length === 0) return "";

  const barWidth = width - 50;
  const barHeight = 8;
  const barX = 25;

  let barSegments = "";
  let offset = 0;

  for (const lang of stats.topLanguages) {
    const segWidth = (lang.percentage / 100) * barWidth;
    const rx = offset === 0 ? 4 : 0;
    const rxEnd = offset + segWidth >= barWidth - 1 ? 4 : 0;

    barSegments += `<rect x="${barX + offset}" y="${y}" width="${segWidth}" height="${barHeight}" fill="${lang.color}" rx="${Math.max(rx, rxEnd)}"/>`;
    offset += segWidth;
  }

  // Language legend
  let legendY = y + 22;
  let legendX = barX;
  let legendItems = "";

  for (const lang of stats.topLanguages) {
    const itemWidth = lang.name.length * 7.5 + 40;

    if (legendX + itemWidth > barX + barWidth) {
      legendX = barX;
      legendY += 20;
    }

    legendItems += `
      <g transform="translate(${legendX}, ${legendY})">
        <circle cx="5" cy="5" r="5" fill="${lang.color}"/>
        <text x="14" y="9" font-size="11" fill="${colors.textSecondary}" font-family="'Segoe UI', Ubuntu, sans-serif">
          ${escapeXml(lang.name)} ${lang.percentage}%
        </text>
      </g>
    `;

    legendX += itemWidth;
  }

  return `
    <rect x="${barX}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${colors.barBg}" rx="4"/>
    ${barSegments}
    ${legendItems}
  `;
}

export function renderCard(stats: UserStats, options: CardOptions = { username: "" }): string {
  const theme: Theme = options.theme || "dark";
  const colors = themes[theme] || themes.dark;
  const width = options.width || 420;
  const showLanguages = options.showLanguages !== false;
  const showBorder = options.showBorder !== false;
  const borderRadius = options.borderRadius ?? 12;

  const baseHeight = 180;
  const langSectionHeight = showLanguages && stats.topLanguages.length > 0 ? 90 : 0;
  const height = baseHeight + langSectionHeight;

  const border = showBorder
    ? `stroke="${colors.border}" stroke-width="1" stroke-opacity="1"`
    : "";

  let svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${borderRadius}" fill="${colors.bg}" ${border}/>

  <!-- Title -->
  <g class="animate delay-1">
    <text x="25" y="38" font-size="16" font-weight="700" fill="${colors.title}" font-family="'Segoe UI', Ubuntu, sans-serif">
      ${escapeXml(stats.name)}
    </text>
    <text x="25" y="56" font-size="12" fill="${colors.textSecondary}" font-family="'Segoe UI', Ubuntu, sans-serif">
      @${escapeXml(stats.username)} · member since ${escapeXml(stats.memberSince)}
    </text>
  </g>

  <!-- Stats Grid -->
  <g class="animate delay-2">
    ${renderStatItem(25, 88, iconStar(), "Stars", stats.totalStars, colors)}
    ${renderStatItem(145, 88, iconFork(), "Forks", stats.totalForks, colors)}
    ${renderStatItem(265, 88, iconRepo(), "Repos", stats.totalRepos, colors)}
  </g>

  <g class="animate delay-3">
    ${renderStatItem(25, 138, iconPeople(), "Followers", stats.followers, colors)}
  </g>
`;

  if (showLanguages && stats.topLanguages.length > 0) {
    svg += `
  <!-- Languages -->
  <g class="animate delay-4">
    <text x="25" y="${baseHeight + 8}" font-size="12" fill="${colors.textSecondary}" font-weight="600" font-family="'Segoe UI', Ubuntu, sans-serif" text-transform="uppercase" letter-spacing="0.5">
      Top Languages
    </text>
    ${renderLanguageBar(stats, baseHeight + 18, width, colors)}
  </g>
`;
  }

  svg += `</svg>`;

  return svg.trim();
}
