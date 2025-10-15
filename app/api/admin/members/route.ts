// app/api/admin/members/route.ts
import { NextResponse } from "next/server";
import { listMembers, createMember } from "@/lib/memberStore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return NextResponse.json(listMembers(url.searchParams));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = createMember(body);
  return NextResponse.json(item, { status: 201 });
}
