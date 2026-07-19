// The SDUI contract shared by the renderer, the API, and the admin dashboard.

export interface ScreenConfig {
  screenId: string;
  header: {
    brand?: string; // short mark, e.g. "BGB"
    brandFull?: string; // e.g. "Balaji Grand Bazar"
    etaText: string;
    address: string;
    searchPlaceholders: string[];
  };
  tabs: TabConfig[];
  bottomNav: BottomNavItem[];
}

export interface TabConfig {
  id: string;
  title: string;
  icon: string; // emoji
  badge?: { text: string; color: string };
  theme: TabTheme;
  widgets: WidgetInstance[];
}

export interface TabTheme {
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  dark: boolean; // true → light text on the header area
}

export interface WidgetInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface BottomNavItem {
  icon: string; // icon key (home | bag | grid | receipt | print | person) or an emoji fallback
  label: string;
  active?: boolean;
}

// ---- Store-level types ----

export interface VersionMeta {
  version: number;
  publishedAt: string;
  label?: string;
}

export interface ScreenMeta {
  liveVersion: number;
  versions: VersionMeta[];
}

// ---- Common widget prop shapes (informal; props stay open) ----

export interface Product {
  emoji: string;
  bg: string; // card art background
  name: string;
  qty: string;
  price: number;
  mrp?: number;
  offText?: string;
  rating?: number;
  ratingCount?: string;
  eta?: string;
  tag?: string;
  left?: number;
}
