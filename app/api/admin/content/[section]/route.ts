// app/api/admin/content/[section]/route.ts
import { NextResponse } from "next/server";
import { list, create } from "@/lib/store";

export async function GET(req: Request, ctx: { params: Promise<{ section: string }> }) {
  const { section } = await ctx.params;
  const url = new URL(req.url);
  return NextResponse.json(list(section, url.searchParams));
}

export async function POST(req: Request, ctx: { params: Promise<{ section: string }> }) {
  const { section } = await ctx.params;
  const body = await req.json();
  const item = create(section, body);
  return NextResponse.json(item, { status: 201 });
}
