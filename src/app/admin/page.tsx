"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ScreenConfig, ScreenMeta, TabConfig, WidgetInstance } from "@/lib/sdui/types";
import { PhoneApp, PhoneFrame } from "@/components/sdui/PhoneApp";
import { WIDGET_TYPES } from "@/components/sdui/widgets";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_PROPS: Record<string, any> = {
  campaign_banner: { kicker: "BIG", title: "New Campaign", subtitle: "Limited time", emoji: "🎉", titleColor: "#E75480", bg: "transparent" },
  info_strip: { icon: "🎁", strong: "FREE GIFT", text: "on orders above ₹499", bg: "#FFFFFF", color: "#5B2333" },
  deal_card_grid: { cards: [{ badge: "Up to 50% OFF", title: "New Deal", emoji: "🛍️", bg: "#FDF3F6" }] },
  cta_banner_pair: {
    left: { title: "BUY 1 GET 1", subtitle: "on items", emoji: "🛒", bg: "#F06292" },
    right: { title: "BUY 2", subtitle: "on items", emoji: "🛒", bg: "#F06292" },
  },
  strip_banner: { emoji: "🎀", title: "Announcement title", subtitle: "Supporting text", bg: "#FEF6DC" },
  circle_category_rail: { items: [{ emoji: "🛒", label: "Category", selected: true }] },
  category_grid: { columns: 3, items: [{ emoji: "🛒", label: "Category", bg: "#EAF1F8" }] },
  section_title: { title: "Section title" },
  product_rail: { title: "Products", products: [{ emoji: "🛒", bg: "#EFEFEF", name: "Sample product", qty: "1 pc", price: 99, eta: "10 mins" }] },
  product_grid: { columns: 3, products: [{ emoji: "🛒", bg: "#EFEFEF", name: "Sample product", qty: "1 pc", price: 99, eta: "10 mins" }] },
  see_all_button: { text: "See all products", emoji: "🛒" },
};

// When the API is deployed with ADMIN_TOKEN set, store the token once via
// localStorage.setItem("adminToken", "...") in the browser console.
function authHeaders(): Record<string, string> {
  const t = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Admin() {
  const [config, setConfig] = useState<ScreenConfig | null>(null);
  const [meta, setMeta] = useState<ScreenMeta | null>(null);
  const [tabId, setTabId] = useState<string>("");
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [propsText, setPropsText] = useState("");
  const [propsError, setPropsError] = useState("");
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);
  const [tokenOk, setTokenOk] = useState<boolean | null>(null);
  const [tokenInput, setTokenInput] = useState("");

  const load = useCallback(async () => {
    const [draftRes, metaRes] = await Promise.all([
      fetch("/api/screen/home/draft"),
      fetch("/api/screen/home/versions"),
    ]);
    const draft = await draftRes.json();
    setConfig(draft.config);
    setMeta(await metaRes.json());
    setTabId((t) => t || draft.config?.tabs?.[0]?.id || "");
    setDirty(false);
  }, []);

  const verifyToken = useCallback(async () => {
    const res = await fetch("/api/admin/check", { headers: authHeaders() });
    setTokenOk(res.ok);
    return res.ok;
  }, []);

  useEffect(() => {
    load();
    verifyToken();
  }, [load, verifyToken]);

  async function saveToken() {
    localStorage.setItem("adminToken", tokenInput.trim());
    setTokenInput("");
    const ok = await verifyToken();
    setStatus(ok ? "🔑 Token verified — you're authorized" : "⛔ Token rejected — check it matches Vercel's ADMIN_TOKEN");
  }

  const tab = useMemo(() => config?.tabs.find((t) => t.id === tabId), [config, tabId]);
  const widget = useMemo(() => tab?.widgets.find((w) => w.id === selectedWidget), [tab, selectedWidget]);

  function update(fn: (c: ScreenConfig) => ScreenConfig) {
    setConfig((c) => (c ? fn(structuredClone(c)) : c));
    setDirty(true);
  }

  function updateTab(fn: (t: TabConfig) => void) {
    update((c) => {
      const t = c.tabs.find((x) => x.id === tabId);
      if (t) fn(t);
      return c;
    });
  }

  function selectWidget(w: WidgetInstance | null) {
    setSelectedWidget(w?.id ?? null);
    setPropsText(w ? JSON.stringify(w.props, null, 2) : "");
    setPropsError("");
  }

  function applyProps(text: string) {
    setPropsText(text);
    try {
      const parsed = JSON.parse(text);
      setPropsError("");
      updateTab((t) => {
        const w = t.widgets.find((x) => x.id === selectedWidget);
        if (w) w.props = parsed;
      });
    } catch (e) {
      setPropsError((e as Error).message);
    }
  }

  function moveWidget(id: string, dir: -1 | 1) {
    updateTab((t) => {
      const i = t.widgets.findIndex((w) => w.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= t.widgets.length) return;
      [t.widgets[i], t.widgets[j]] = [t.widgets[j], t.widgets[i]];
    });
  }

  async function saveDraft(): Promise<boolean> {
    setStatus("Saving…");
    const res = await fetch("/api/screen/home/draft", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ config }),
    });
    if (res.status === 401) {
      setStatus("⛔ Unauthorized — click 🔑 Set token and enter your ADMIN_TOKEN");
      return false;
    }
    setStatus("Draft saved");
    setDirty(false);
    return true;
  }

  async function publishNow() {
    if (!(await saveDraft())) return;
    setStatus("Publishing…");
    const res = await fetch("/api/screen/home/publish", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ label: `Published from dashboard` }),
    });
    if (res.status === 401) {
      setStatus("⛔ Unauthorized — click 🔑 Set token and enter your ADMIN_TOKEN");
      return;
    }
    const json = await res.json();
    setStatus(json.ok ? `🚀 Published v${json.version} — live now` : `Error: ${json.error}`);
    load();
  }

  async function rollbackTo(version: number) {
    setStatus(`Rolling back to v${version}…`);
    const res = await fetch("/api/screen/home/versions", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ version }),
    });
    if (res.status === 401) {
      setStatus("⛔ Unauthorized — click 🔑 Set token and enter your ADMIN_TOKEN");
      return;
    }
    setStatus(`↩️ Live is now v${version}`);
    await load();
    selectWidget(null);
  }

  if (!config)
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading dashboard…</div>;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Token gate — shown automatically when the stored token is missing or rejected */}
      {tokenOk === false ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-gray-900">🔑 Admin token required</h2>
            <p className="mt-1 text-sm text-gray-500">
              Paste the ADMIN_TOKEN (same value as in Vercel → Settings → Environment Variables). It's saved in this
              browser so you won't be asked again.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveToken();
              }}
            >
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ADMIN_TOKEN"
                autoFocus
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-gray-900 focus:outline-none"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setTokenOk(null)} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
                  Later
                </button>
                <button type="submit" disabled={!tokenInput.trim()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
                  Save & verify
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Top bar */}
      <div className="flex items-center gap-4 border-b bg-white px-6 py-3 shadow-sm">
        <h1 className="text-lg font-extrabold text-gray-900">🛠️ UI Control Center</h1>
        <span className="text-xs text-gray-500">screen: home · live v{meta?.liveVersion}</span>
        <span className="ml-auto text-xs text-gray-500">{status}</span>
        {dirty ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">unsaved</span> : null}
        <button
          onClick={() => setTokenOk(false)}
          title="Change the admin token for this browser"
          className={`rounded-lg border px-3 py-1.5 text-sm ${tokenOk ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-red-300 bg-red-50 text-red-700"}`}
        >
          {tokenOk ? "🔑 Authorized" : "🔑 Set token"}
        </button>
        <button onClick={saveDraft} className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-semibold hover:bg-gray-50">
          Save draft
        </button>
        <button onClick={publishNow} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">
          🚀 Publish
        </button>
        <a href="/" target="_blank" className="text-xs text-sky-600 underline">view app →</a>
      </div>

      <div className="flex gap-4 p-4">
        {/* Left: tabs + widgets */}
        <div className="w-[320px] space-y-4">
          <section className="rounded-xl bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase text-gray-500">Tabs</h2>
            <div className="flex flex-wrap gap-1.5">
              {config.tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTabId(t.id); selectWidget(null); }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${t.id === tabId ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {t.icon} {t.title}
                </button>
              ))}
              <button
                onClick={() => {
                  const id = `tab-${uid()}`;
                  update((c) => {
                    c.tabs.push({ id, title: "New Tab", icon: "🆕", theme: { gradientFrom: "#E5E7EB", gradientTo: "#F9FAFB", accent: "#374151", dark: false }, widgets: [] });
                    return c;
                  });
                  setTabId(id);
                }}
                className="rounded-lg border border-dashed border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-400"
              >
                + Add
              </button>
            </div>

            {tab ? (
              <div className="mt-3 space-y-2 border-t pt-3">
                <div className="flex gap-2">
                  <label className="flex-1 text-xs text-gray-600">
                    Title
                    <input value={tab.title} onChange={(e) => updateTab((t) => { t.title = e.target.value; })}
                      className="mt-0.5 w-full rounded border px-2 py-1 text-sm" />
                  </label>
                  <label className="w-16 text-xs text-gray-600">
                    Icon
                    <input value={tab.icon} onChange={(e) => updateTab((t) => { t.icon = e.target.value; })}
                      className="mt-0.5 w-full rounded border px-2 py-1 text-sm" />
                  </label>
                </div>
                <div className="flex items-end gap-2">
                  {(["gradientFrom", "gradientTo", "accent"] as const).map((k) => (
                    <label key={k} className="text-xs text-gray-600">
                      {k.replace("gradient", "")}
                      <input type="color" value={tab.theme[k]} onChange={(e) => updateTab((t) => { t.theme[k] = e.target.value; })}
                        className="mt-0.5 block h-8 w-12 cursor-pointer rounded border" />
                    </label>
                  ))}
                  <label className="ml-1 flex items-center gap-1 pb-2 text-xs text-gray-600">
                    <input type="checkbox" checked={tab.theme.dark} onChange={(e) => updateTab((t) => { t.theme.dark = e.target.checked; })} />
                    dark header
                  </label>
                  <button
                    onClick={() => {
                      if (!confirm(`Delete tab "${tab.title}"?`)) return;
                      update((c) => { c.tabs = c.tabs.filter((t) => t.id !== tabId); return c; });
                      setTabId(config.tabs.find((t) => t.id !== tabId)?.id ?? "");
                      selectWidget(null);
                    }}
                    className="ml-auto pb-1 text-xs text-red-500 hover:underline"
                  >
                    delete tab
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase text-gray-500">Widgets in “{tab?.title}”</h2>
            <div className="space-y-1.5">
              {tab?.widgets.map((w, i) => (
                <div
                  key={w.id}
                  onClick={() => selectWidget(w)}
                  className={`flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1.5 text-xs ${selectedWidget === w.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <span className="w-5 text-gray-400">{i + 1}.</span>
                  <span className="flex-1 font-semibold text-gray-800">{w.type}</span>
                  <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, -1); }} className="px-1 text-gray-400 hover:text-gray-900">↑</button>
                  <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, 1); }} className="px-1 text-gray-400 hover:text-gray-900">↓</button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTab((t) => {
                        const idx = t.widgets.findIndex((x) => x.id === w.id);
                        t.widgets.splice(idx + 1, 0, { ...structuredClone(t.widgets[idx]), id: uid() });
                      });
                    }}
                    className="px-1 text-gray-400 hover:text-gray-900"
                    title="duplicate"
                  >⎘</button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTab((t) => { t.widgets = t.widgets.filter((x) => x.id !== w.id); });
                      if (selectedWidget === w.id) selectWidget(null);
                    }}
                    className="px-1 text-red-400 hover:text-red-600"
                  >✕</button>
                </div>
              ))}
            </div>
            <div className="mt-2 border-t pt-2">
              <label className="text-xs text-gray-500">Add widget</label>
              <select
                value=""
                onChange={(e) => {
                  const type = e.target.value;
                  if (!type) return;
                  const w = { id: uid(), type, props: structuredClone(DEFAULT_PROPS[type] ?? {}) };
                  updateTab((t) => { t.widgets.push(w); });
                  selectWidget(w);
                }}
                className="mt-1 w-full rounded border px-2 py-1.5 text-sm"
              >
                <option value="">— pick from widget palette —</option>
                {WIDGET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </section>

          <section className="rounded-xl bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase text-gray-500">Version history</h2>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {[...(meta?.versions ?? [])].reverse().map((v) => (
                <div key={v.version} className="flex items-center gap-2 text-xs">
                  <span className={`font-mono ${v.version === meta?.liveVersion ? "font-bold text-emerald-600" : "text-gray-600"}`}>
                    v{v.version}{v.version === meta?.liveVersion ? " · LIVE" : ""}
                  </span>
                  <span className="flex-1 truncate text-gray-400">{v.label ?? ""} · {new Date(v.publishedAt).toLocaleString()}</span>
                  {v.version !== meta?.liveVersion ? (
                    <button onClick={() => rollbackTo(v.version)} className="text-sky-600 hover:underline">rollback</button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Center: live preview */}
        <div className="flex-1">
          <div className="sticky top-4 origin-top scale-[0.92]">
            <PhoneFrame>
              <PhoneApp config={config} activeTabId={tabId} onTabChange={setTabId} />
            </PhoneFrame>
            <p className="mt-2 text-center text-xs text-gray-400">Live draft preview — same renderer as the real app</p>
          </div>
        </div>

        {/* Right: props editor */}
        <div className="w-[360px]">
          <section className="rounded-xl bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase text-gray-500">
              {widget ? `Props · ${widget.type}` : "Props editor"}
            </h2>
            {widget ? (
              <>
                <textarea
                  value={propsText}
                  onChange={(e) => applyProps(e.target.value)}
                  spellCheck={false}
                  className={`h-[560px] w-full rounded-lg border p-2 font-mono text-[11px] leading-relaxed ${propsError ? "border-red-400" : "border-gray-200"}`}
                />
                {propsError ? <p className="mt-1 text-xs text-red-500">JSON error: {propsError}</p> : (
                  <p className="mt-1 text-xs text-emerald-600">Valid — preview updates live</p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400">Select a widget on the left to edit its props. Changes render instantly in the preview.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
