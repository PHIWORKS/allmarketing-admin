import { NextResponse } from "next/server";
import { getAdminAccount, updateAdminAccount } from "@/lib/adminAccounts.store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const item = getAdminAccount(id);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const patch = await req.json();
    const saved = updateAdminAccount(id, patch);
    if (!saved) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
