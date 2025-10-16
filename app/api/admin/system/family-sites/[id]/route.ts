import { NextResponse } from "next/server";
import { getFamilySite, updateFamilySite, removeFamilySite } from "@/lib/familySites.store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const item = getFamilySite(id);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const patch = await req.json();
  const item = updateFamilySite(id, patch);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const ok = removeFamilySite(id);
  return NextResponse.json({ ok });
}
