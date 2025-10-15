import { NextResponse } from "next/server";
import { GroupStore } from "@/lib/memberGroupStore";

export async function GET(req: Request) {
  const url = new URL(req.url, "http://localhost"); // absolute base for Node URL
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const page = Number(url.searchParams.get("page") || "1");
  const size = Number(url.searchParams.get("size") || "10");

  const all = GroupStore.list().filter((g) =>
    g.name.toLowerCase().includes(q)
  );
  const start = (page - 1) * size;
  const rows = all.slice(start, start + size);

  return NextResponse.json({ total: all.length, rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = GroupStore.create(body);
  return NextResponse.json(created, { status: 201 });
}
