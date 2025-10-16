import { NextResponse } from "next/server";
import { listInquiries, createInquiry, type InquiryStatus } from "@/lib/inquiries.store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const status = (url.searchParams.get("status") || "") as InquiryStatus | "";
  const page = Number(url.searchParams.get("page") || "1");
  const size = Number(url.searchParams.get("size") || "10");
  return NextResponse.json(listInquiries({ q, status, page, size }));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = createInquiry(body);
  return NextResponse.json(item, { status: 201 });
}
