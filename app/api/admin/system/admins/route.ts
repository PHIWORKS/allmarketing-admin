import { NextResponse } from "next/server";
import { listAdminAccounts, createAdminAccount } from "@/lib/adminAccounts.store";

export async function GET() {
  return NextResponse.json(listAdminAccounts());
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Partial<AdminAccount>
    const item = createAdminAccount(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
