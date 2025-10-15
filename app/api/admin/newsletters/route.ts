import { NextResponse } from "next/server";
import { listNewsletters, createNewsletter } from "@/lib/newsletters.store";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const status = url.searchParams.get("status") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const size = Number(url.searchParams.get("size") || "10");

    const result = listNewsletters({ q, status, page, size });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "bad request" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = createNewsletter(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "bad request" }, { status: 400 });
  }
}
