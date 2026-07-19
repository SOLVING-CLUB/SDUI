import { NextResponse } from "next/server";
import { publish } from "@/lib/sdui/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const label = (await req.json().catch(() => ({})))?.label as string | undefined;
  try {
    const entry = await publish(id, label);
    return NextResponse.json({ ok: true, version: entry.version });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
