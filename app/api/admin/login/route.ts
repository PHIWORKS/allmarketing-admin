import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, password, remember } = await req.json();

  // ⚠️ 데모: 하드코딩 (추후 DB/SSO로 교체)
  const OK = id === "admin" && password === "admin1234";

  if (!OK) {
    return NextResponse.json({ ok: false, message: "아이디/비밀번호를 확인해주세요." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // 데모 토큰 (서버 검증 없음)
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 4; // 30일 or 4시간
  res.cookies.set("admintoken", "demo-token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });
  return res;
}
