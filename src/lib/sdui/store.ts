import { promises as fs } from "fs";
import path from "path";
import { ScreenConfig, ScreenMeta, VersionMeta } from "./types";
import { seedHomeConfig } from "./seed";

// v1 config store: versioned JSON files under data/screens/<id>/.
// Swap this module for a Supabase/Postgres implementation when deploying
// to serverless — the exported functions are the store interface.

const DATA_DIR = path.join(process.cwd(), "data", "screens");

function screenDir(id: string) {
  // Screen ids are path components — reject anything outside a strict slug.
  if (!/^[a-z0-9_-]{1,64}$/.test(id)) throw new Error("invalid screen id");
  return path.join(DATA_DIR, id);
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

async function ensureSeeded(id: string): Promise<void> {
  if (id !== "home") return;
  const meta = await readJson<ScreenMeta>(path.join(screenDir(id), "meta.json"));
  if (meta) return;
  await writeJson(path.join(screenDir(id), "versions", "1.json"), seedHomeConfig);
  await writeJson(path.join(screenDir(id), "draft.json"), seedHomeConfig);
  await writeJson(path.join(screenDir(id), "meta.json"), {
    liveVersion: 1,
    versions: [{ version: 1, publishedAt: new Date().toISOString(), label: "Seed layout" }],
  } satisfies ScreenMeta);
}

export async function getMeta(id: string): Promise<ScreenMeta | null> {
  await ensureSeeded(id);
  return readJson<ScreenMeta>(path.join(screenDir(id), "meta.json"));
}

export async function getPublished(
  id: string
): Promise<{ config: ScreenConfig; version: number } | null> {
  const meta = await getMeta(id);
  if (!meta) return null;
  const config = await readJson<ScreenConfig>(
    path.join(screenDir(id), "versions", `${meta.liveVersion}.json`)
  );
  return config ? { config, version: meta.liveVersion } : null;
}

export async function getDraft(id: string): Promise<ScreenConfig | null> {
  await ensureSeeded(id);
  return readJson<ScreenConfig>(path.join(screenDir(id), "draft.json"));
}

export async function saveDraft(id: string, config: ScreenConfig): Promise<void> {
  await ensureSeeded(id);
  await writeJson(path.join(screenDir(id), "draft.json"), config);
}

export async function publish(id: string, label?: string): Promise<VersionMeta> {
  const meta = await getMeta(id);
  const draft = await getDraft(id);
  if (!meta || !draft) throw new Error(`screen ${id} not found`);
  const version = Math.max(...meta.versions.map((v) => v.version)) + 1;
  const entry: VersionMeta = { version, publishedAt: new Date().toISOString(), label };
  await writeJson(path.join(screenDir(id), "versions", `${version}.json`), draft);
  await writeJson(path.join(screenDir(id), "meta.json"), {
    liveVersion: version,
    versions: [...meta.versions, entry],
  } satisfies ScreenMeta);
  return entry;
}

export async function rollback(id: string, version: number): Promise<void> {
  const meta = await getMeta(id);
  if (!meta) throw new Error(`screen ${id} not found`);
  if (!meta.versions.some((v) => v.version === version))
    throw new Error(`version ${version} not found`);
  const config = await readJson<ScreenConfig>(
    path.join(screenDir(id), "versions", `${version}.json`)
  );
  await writeJson(path.join(screenDir(id), "meta.json"), { ...meta, liveVersion: version });
  if (config) await writeJson(path.join(screenDir(id), "draft.json"), config);
}
