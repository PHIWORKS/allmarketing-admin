// app/api/admin/content/[section]/[id]/route.ts
import { NextResponse } from "next/server";
import { getOne, update } from "@/lib/store";

export async function GET(_req: Request, ctx: { params: Promise<{ section: string; id: string }> }) {
  const { section, id } = await ctx.params;
  const item = getOne(section, id);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ section: string; id: string }> }) {
  const { section, id } = await ctx.params;
  const patch = await req.json();
  try {
    const item = update(section, id, patch);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
