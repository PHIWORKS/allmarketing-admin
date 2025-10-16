// app/api/admin/system/basics/route.ts
import { NextResponse } from "next/server";
import { getBasics, updateBasics, type SystemBasics } from "@/lib/system.store";

export async function GET() {
  try {
    const basics = getBasics();
    return NextResponse.json(basics);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "failed to load basics";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as Partial<SystemBasics>;
    const saved = updateBasics(body);
    return NextResponse.json(saved);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "failed to update basics";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
