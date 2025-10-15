import { NextResponse } from "next/server";
import { GroupStore } from "@/lib/memberGroupStore";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const g = GroupStore.get(id);
  if (!g) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(g);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const patch = await req.json();
  try {
    const updated = GroupStore.update(id, patch);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  GroupStore.remove(id);
  return NextResponse.json({ ok: true });
}
