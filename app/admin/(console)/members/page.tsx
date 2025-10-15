import { Suspense } from "react";
import MemberListClient from "./MemberListClient";

export const dynamic = "force-dynamic"; // 프리렌더 방지

export default function Page() {
  return (
    <Suspense fallback={<div>로딩중…</div>}>
      <MemberListClient />
    </Suspense>
  );
}