import { NextResponse } from "next/server";
import { getPublished } from "@/lib/sdui/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPublished(id);
  if (!result) return NextResponse.json({ error: "screen not found" }, { status: 404 });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
