import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"], // /admin 이하만 감시
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admintoken")?.value;

  // 로그인 페이지는 예외
  if (pathname.startsWith("/admin/login")) {
    // 이미 로그인 상태면 대시보드로
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 나머지 /admin/* 은 토큰 없으면 로그인으로 보냄
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname); // 로그인 후 돌아올 경로
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
