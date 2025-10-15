// app/api/admin/newsletters/route.ts
import { NextResponse } from "next/server";
import { listNewsletters, createNewsletter } from "@/lib/newsletters.store";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const qRaw = url.searchParams.get("q") ?? "";
    const statusRaw = url.searchParams.get("status") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "10");

    // listNewsletters의 첫 번째 인자 타입을 그대로 추론
    type ListParams = Parameters<typeof listNewsletters>[0];

    const params: ListParams = {
      q: qRaw.toLowerCase(),
      status: statusRaw as ListParams["status"],
      page,
      size,
    };

    const result = listNewsletters(params);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = createNewsletter(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
