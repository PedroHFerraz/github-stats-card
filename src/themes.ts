export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  border: string;
  title: string;
  text: string;
  textSecondary: string;
  icon: string;
  accent: string;
  barBg: string;
}

export const themes: Record<string, ThemeColors> = {
  dark: {
    bg: "#0d1117",
    bgSecondary: "#161b22",
    border: "#30363d",
    title: "#f0f6fc",
    text: "#e6edf3",
    textSecondary: "#8b949e",
    icon: "#58a6ff",
    accent: "#58a6ff",
    barBg: "#21262d",
  },

  light: {
    bg: "#ffffff",
    bgSecondary: "#f6f8fa",
    border: "#d1d9e0",
    title: "#1f2328",
    text: "#1f2328",
    textSecondary: "#656d76",
    icon: "#0969da",
    accent: "#0969da",
    barBg: "#eaeef2",
  },

  dracula: {
    bg: "#282a36",
    bgSecondary: "#343746",
    border: "#6272a4",
    title: "#f8f8f2",
    text: "#f8f8f2",
    textSecondary: "#6272a4",
    icon: "#bd93f9",
    accent: "#ff79c6",
    barBg: "#44475a",
  },

  nord: {
    bg: "#2e3440",
    bgSecondary: "#3b4252",
    border: "#4c566a",
    title: "#eceff4",
    text: "#d8dee9",
    textSecondary: "#81a1c1",
    icon: "#88c0d0",
    accent: "#88c0d0",
    barBg: "#434c5e",
  },

  sunset: {
    bg: "#1a1025",
    bgSecondary: "#231535",
    border: "#3d2560",
    title: "#ffecd2",
    text: "#f5d5b5",
    textSecondary: "#c9879f",
    icon: "#ff6b6b",
    accent: "#feca57",
    barBg: "#2d1a45",
  },
};

export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  Zig: "#ec915c",
  Nix: "#7e7eff",
  default: "#8b949e",
};
