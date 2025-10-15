import { NextResponse } from "next/server";
import { SubscriberStore } from "@/lib/subscriberStore";

export async function GET(req: Request) {
  // Node URL 파서는 절대 URL이 필요합니다
  const url = new URL(req.url, "http://localhost");
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const status = url.searchParams.get("status") || "";
  const page = Number(url.searchParams.get("page") || "1");
  const size = Number(url.searchParams.get("size") || "10");

  let all = SubscriberStore.list();
  if (q) {
    all = all.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        (s.name || "").toLowerCase().includes(q)
    );
  }
  if (status) all = all.filter((s) => s.status === status);

  const start = (page - 1) * size;
  const rows = all.slice(start, start + size);

  return NextResponse.json({ total: all.length, rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = SubscriberStore.create(body);
  return NextResponse.json(created, { status: 201 });
}
