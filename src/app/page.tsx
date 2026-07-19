"use client";

import { useCallback, useEffect, useState } from "react";
import { ScreenConfig } from "@/lib/sdui/types";
import { PhoneApp, PhoneFrame } from "@/components/sdui/PhoneApp";

export default function Home() {
  const [data, setData] = useState<{ config: ScreenConfig; version: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/screen/home", { cache: "no-store" });
    setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-slate-300">
          <h1 className="text-lg font-bold text-white">Quick-Commerce SDUI Demo</h1>
          {data?.version ? (
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              serving layout v{data.version}
            </span>
          ) : null}
          <button
            onClick={load}
            className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-600"
          >
            {loading ? "…" : "↻ Refresh (simulate app reopen)"}
          </button>
          <a href="/admin" className="text-xs text-sky-400 underline">
            open dashboard →
          </a>
        </div>
        <PhoneFrame>
          {data?.config ? (
            <PhoneApp config={data.config} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">Loading layout…</div>
          )}
        </PhoneFrame>
        <p className="max-w-md text-center text-xs text-slate-400">
          Every pixel inside the phone — tabs, themes, banners, product rails — is rendered from JSON
          served by <code>/api/screen/home</code>. Change it in the dashboard, publish, refresh: no app build.
        </p>
      </div>
    </main>
  );
}
