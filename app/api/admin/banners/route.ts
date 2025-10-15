// app/api/admin/banners/route.ts
import { NextResponse } from "next/server";
import { listBanners, createBanner } from "@/lib/banners.store";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const q = url.searchParams.get("q") ?? "";
  const rawStatus = url.searchParams.get("status") ?? "";
  const rawPlace  = url.searchParams.get("place") ?? "";
  const page = Number(url.searchParams.get("page") ?? "1");
  const size = Number(url.searchParams.get("size") ?? "10");

  // ✅ listBanners 가 기대하는 첫 번째 인자의 타입을 그대로 추론해 사용
  type ListParams = Parameters<typeof listBanners>[0];

  const params: ListParams = {
    q,
    status: rawStatus as ListParams["status"],
    place:  rawPlace  as ListParams["place"],
    page,
    size,
  };

  return NextResponse.json(listBanners(params));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = createBanner(body);
  return NextResponse.json(item, { status: 201 });
}
