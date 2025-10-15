import { NextResponse } from "next/server";
import { listBanners, createBanner } from "@/lib/banners.store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const status = (url.searchParams.get("status") || "") as any;
  const place = (url.searchParams.get("place") || "") as any;
  const page = Number(url.searchParams.get("page") || "1");
  const size = Number(url.searchParams.get("size") || "10");
  return NextResponse.json(listBanners({ q, status, place, page, size }));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = createBanner(body);
  return NextResponse.json(item, { status: 201 });
}
