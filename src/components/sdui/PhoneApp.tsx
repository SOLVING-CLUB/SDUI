"use client";

import { useEffect, useState } from "react";
import { ScreenConfig, WidgetInstance } from "@/lib/sdui/types";
import { WIDGET_REGISTRY } from "./widgets";

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
          <div>
            <div className="text-[11px] font-semibold opacity-80">Blinkit in</div>
            <div className="text-2xl font-extrabold leading-6">{config.header.etaText}</div>
            <div className="mt-0.5 text-[11px] font-medium opacity-90">{config.header.address} ▾</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-[11px] shadow">💳 ₹0</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">👤</span>
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
      <div className="flex flex-shrink-0 items-center justify-around border-t bg-white px-2 py-1.5">
        {config.bottomNav.map((n, i) => (
          <div key={i} className={`flex flex-col items-center text-[10px] ${n.active ? "font-bold text-gray-900" : "text-gray-500"}`}>
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </div>
        ))}
        <span className="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold italic text-white">district</span>
      </div>
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
