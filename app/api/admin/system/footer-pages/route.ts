// app/api/admin/system/footer-pages/route.ts
import { NextResponse } from "next/server";
import {
  listFooterPages,
  createFooterPage,
  type FooterPage,
} from "@/lib/footerPages.store";

export async function GET() {
  try {
    const rows = listFooterPages();
    return NextResponse.json({ total: rows.length, rows });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<FooterPage>;
    const item = createFooterPage(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "failed to create";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
