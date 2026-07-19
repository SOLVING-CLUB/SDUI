"use client";

import { useEffect, useState } from "react";
import { BottomNavItem, ScreenConfig, WidgetInstance } from "@/lib/sdui/types";
import { WIDGET_REGISTRY } from "./widgets";

const BRAND_RED = "#C21B17";

// Inline SVG nav icons (keys match the config's bottomNav icon field).
const NAV_ICON_PATHS: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
  bag: "M6 7V6a6 6 0 1 1 12 0v1h2a1 1 0 0 1 1 1l-1 12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 8a1 1 0 0 1 1-1h2Zm2 0h8V6a4 4 0 1 0-8 0v1Z",
  grid: "M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z",
  receipt: "M5 2h14a1 1 0 0 1 1 1v19l-3-2-3 2-3-2-3 2-3-2V3a1 1 0 0 1 1-1Zm3 5h8v2H8V7Zm0 4h8v2H8v-2Z",
  print: "M6 3h12v4h2a2 2 0 0 1 2 2v7h-4v4H6v-4H2V9a2 2 0 0 1 2-2h2V3Zm2 12v4h8v-4H8Zm0-10v2h8V5H8Z",
  person: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V21h18v-1.5c0-3-4-5.5-9-5.5Z",
};

function BottomNav({ items }: { items: BottomNavItem[] }) {
  const [active, setActive] = useState(() => Math.max(0, items.findIndex((n) => n.active)));
  return (
    <div className="flex flex-shrink-0 items-stretch border-t border-gray-100 bg-white px-1 pb-2.5 pt-1.5 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      {items.map((n, i) => {
        const isActive = i === active;
        const path = NAV_ICON_PATHS[n.icon];
        const color = isActive ? BRAND_RED : "#6B7280";
        return (
          <button key={i} onClick={() => setActive(i)} className="flex flex-1 flex-col items-center gap-0.5">
            <span className={`rounded-full px-4 py-0.5 transition-colors ${isActive ? "bg-[#FCE9E8]" : ""}`}>
              {path ? (
                <svg width="21" height="21" viewBox="0 0 24 24" fill={color} className="transition-colors">
                  <path d={path} />
                </svg>
              ) : (
                <span className="text-lg">{n.icon}</span>
              )}
            </span>
            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`} style={{ color }}>
              {n.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// The SDUI renderer: walks the widget list and delegates to the registry.
// Unknown types are skipped so old clients survive new server payloads.
export function ScreenRenderer({ widgets }: { widgets: WidgetInstance[] }) {
  return (
    <>
      {widgets.map((w) => {
        const Cmp = WIDGET_REGISTRY[w.type];
        return Cmp ? <Cmp key={w.id} {...w.props} /> : null;
      })}
    </>
  );
}

function RotatingPlaceholder({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % Math.max(words.length, 1)), 2000);
    return () => clearInterval(t);
  }, [words.length]);
  return <span className="text-gray-400">Search &quot;{words[i] ?? ""}&quot;</span>;
}

export function PhoneApp({
  config,
  activeTabId,
  onTabChange,
}: {
  config: ScreenConfig;
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}) {
  const [internalTab, setInternalTab] = useState(config.tabs[0]?.id);
  const tabId = activeTabId ?? internalTab;
  const tab = config.tabs.find((t) => t.id === tabId) ?? config.tabs[0];
  const setTab = (id: string) => (onTabChange ? onTabChange(id) : setInternalTab(id));

  if (!tab) return <div className="p-8 text-center text-sm text-gray-500">No tabs configured</div>;

  const headerText = tab.theme.dark ? "text-white" : "text-gray-900";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50 font-sans">
      {/* Themed header area — entirely config-driven */}
      <div
        className="flex-shrink-0"
        style={{ background: `linear-gradient(180deg, ${tab.theme.gradientFrom}, ${tab.theme.gradientTo})` }}
      >
        <div className={`flex items-center justify-between px-4 pt-3 ${headerText}`}>
          <div className="flex items-center gap-3">
            {/* BGB diamond monogram */}
            <div className="flex h-10 w-10 items-center justify-center">
              <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-md bg-[#C21B17]">
                <span className="-rotate-45 text-[10px] font-black tracking-wide text-white">BGB</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold opacity-85">{config.header.brandFull ?? "Balaji Grand Bazar"} in</div>
              <div className="text-2xl font-extrabold leading-6">{config.header.etaText}</div>
              <div className="mt-0.5 text-[11px] font-medium opacity-90">{config.header.address} ▾</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-[11px] shadow">💳 ₹0</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white">👤</span>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] shadow-sm">
            <span>🔍</span>
            <RotatingPlaceholder words={config.header.searchPlaceholders} />
            <span className="ml-auto border-l pl-2 text-gray-400">🎤</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto px-2">
          {config.tabs.map((t) => {
            const active = t.id === tab.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex min-w-[64px] flex-col items-center gap-0.5 px-2 pb-1.5 pt-1 text-[11px] ${headerText} ${active ? "font-bold" : "opacity-70"}`}
              >
                {t.badge ? (
                  <span
                    className="absolute -top-0.5 right-1 rounded-full px-1.5 text-[8px] font-bold text-white"
                    style={{ background: t.badge.color }}
                  >
                    {t.badge.text}
                  </span>
                ) : null}
                <span className="text-lg">{t.icon}</span>
                <span>{t.title}</span>
                <span
                  className="mt-0.5 h-[3px] w-8 rounded-full"
                  style={{ background: active ? (tab.theme.dark ? "#fff" : "#1F2937") : "transparent" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget feed */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: `linear-gradient(180deg, ${tab.theme.gradientTo}, #F9FAFB 240px)` }}
      >
        <div key={tab.id} className="sdui-feed-enter">
          <ScreenRenderer widgets={tab.widgets} />
          <div className="h-4" />
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav items={config.bottomNav} />
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-[780px] w-[380px] overflow-hidden rounded-[36px] border-[10px] border-gray-900 bg-white shadow-2xl">
      <div className="flex h-6 items-center justify-center bg-gray-900">
        <div className="h-3.5 w-24 rounded-full bg-black" />
      </div>
      <div className="h-[calc(100%-1.5rem)]">{children}</div>
    </div>
  );
}
