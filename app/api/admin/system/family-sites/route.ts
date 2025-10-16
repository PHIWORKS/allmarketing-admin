import { NextResponse } from "next/server";
import { listFamilySites, createFamilySite } from "@/lib/familySites.store";

export async function GET() {
  return NextResponse.json(listFamilySites());
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Partial<FamilySite> 형태 예상
    const item = createFamilySite(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
