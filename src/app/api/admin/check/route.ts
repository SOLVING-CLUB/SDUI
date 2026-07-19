import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sdui/auth";

// Lightweight probe the dashboard uses to validate the stored admin token.
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
