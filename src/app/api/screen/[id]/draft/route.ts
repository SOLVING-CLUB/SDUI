import { NextResponse } from "next/server";
import { getDraft, saveDraft } from "@/lib/sdui/store";
import { ScreenConfig } from "@/lib/sdui/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const draft = await getDraft(id);
  if (!draft) return NextResponse.json({ error: "screen not found" }, { status: 404 });
  return NextResponse.json({ config: draft });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { config: ScreenConfig };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!body?.config?.tabs) return NextResponse.json({ error: "config.tabs required" }, { status: 400 });
  await saveDraft(id, body.config);
  return NextResponse.json({ ok: true });
}
