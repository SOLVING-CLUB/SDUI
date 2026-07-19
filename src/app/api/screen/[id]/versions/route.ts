import { NextResponse } from "next/server";
import { getMeta, rollback } from "@/lib/sdui/store";
import { requireAdmin } from "@/lib/sdui/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = await getMeta(id);
  if (!meta) return NextResponse.json({ error: "screen not found" }, { status: 404 });
  return NextResponse.json(meta);
}

// Rollback: re-point live to an existing version.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.version !== "number")
    return NextResponse.json({ error: "version (number) required" }, { status: 400 });
  try {
    await rollback(id, body.version);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
