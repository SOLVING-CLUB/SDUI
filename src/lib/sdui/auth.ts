import { NextResponse } from "next/server";

// Minimal write-protection for the layout API. When ADMIN_TOKEN is set
// (any deployed environment), all mutating routes require it as a Bearer
// token. Locally, leave it unset for a friction-free demo.
export function requireAdmin(req: Request): NextResponse | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return null;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${token}`) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
