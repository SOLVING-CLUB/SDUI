import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ScreenConfig, ScreenMeta, VersionMeta } from "./types";
import { seedHomeConfig } from "./seed";

// Supabase-backed config store. Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// (server-side only — the service role bypasses RLS; never expose it to browsers).

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

function validateId(id: string) {
  if (!/^[a-z0-9_-]{1,64}$/.test(id)) throw new Error("invalid screen id");
}

async function ensureSeeded(id: string): Promise<void> {
  if (id !== "home") return;
  const { data } = await db().from("screen_meta").select("screen_id").eq("screen_id", id).maybeSingle();
  if (data) return;
  await db().from("screen_versions").insert({ screen_id: id, version: 1, config: seedHomeConfig, label: "Seed layout" });
  await db().from("screen_drafts").upsert({ screen_id: id, config: seedHomeConfig });
  await db().from("screen_meta").insert({ screen_id: id, live_version: 1 });
}

export async function getMeta(id: string): Promise<ScreenMeta | null> {
  validateId(id);
  await ensureSeeded(id);
  const { data: meta } = await db().from("screen_meta").select("live_version").eq("screen_id", id).maybeSingle();
  if (!meta) return null;
  const { data: versions } = await db()
    .from("screen_versions")
    .select("version, published_at, label")
    .eq("screen_id", id)
    .order("version");
  return {
    liveVersion: meta.live_version,
    versions: (versions ?? []).map((v) => ({
      version: v.version,
      publishedAt: v.published_at,
      label: v.label ?? undefined,
    })),
  };
}

export async function getPublished(id: string): Promise<{ config: ScreenConfig; version: number } | null> {
  validateId(id);
  await ensureSeeded(id);
  const { data: meta } = await db().from("screen_meta").select("live_version").eq("screen_id", id).maybeSingle();
  if (!meta) return null;
  const { data } = await db()
    .from("screen_versions")
    .select("config")
    .eq("screen_id", id)
    .eq("version", meta.live_version)
    .maybeSingle();
  return data ? { config: data.config as ScreenConfig, version: meta.live_version } : null;
}

export async function getDraft(id: string): Promise<ScreenConfig | null> {
  validateId(id);
  await ensureSeeded(id);
  const { data } = await db().from("screen_drafts").select("config").eq("screen_id", id).maybeSingle();
  return (data?.config as ScreenConfig) ?? null;
}

export async function saveDraft(id: string, config: ScreenConfig): Promise<void> {
  validateId(id);
  await ensureSeeded(id);
  const { error } = await db().from("screen_drafts").upsert({ screen_id: id, config, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

export async function publish(id: string, label?: string): Promise<VersionMeta> {
  const meta = await getMeta(id);
  const draft = await getDraft(id);
  if (!meta || !draft) throw new Error(`screen ${id} not found`);
  const version = Math.max(...meta.versions.map((v) => v.version)) + 1;
  const publishedAt = new Date().toISOString();
  const { error } = await db()
    .from("screen_versions")
    .insert({ screen_id: id, version, config: draft, label, published_at: publishedAt });
  if (error) throw new Error(error.message);
  await db().from("screen_meta").update({ live_version: version }).eq("screen_id", id);
  return { version, publishedAt, label };
}

export async function rollback(id: string, version: number): Promise<void> {
  validateId(id);
  const { data } = await db()
    .from("screen_versions")
    .select("config")
    .eq("screen_id", id)
    .eq("version", version)
    .maybeSingle();
  if (!data) throw new Error(`version ${version} not found`);
  await db().from("screen_meta").update({ live_version: version }).eq("screen_id", id);
  await db().from("screen_drafts").upsert({ screen_id: id, config: data.config });
}
