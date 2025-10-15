import { NextResponse } from "next/server";
import { getBanner, updateBanner, removeBanner } from "@/lib/banners.store";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const item = getBanner(ctx.params.id);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const patch = await req.json();
  const item = updateBanner(ctx.params.id, patch);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const ok = removeBanner(ctx.params.id);
  return NextResponse.json({ ok });
}
