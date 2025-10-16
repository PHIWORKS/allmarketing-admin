import { Suspense } from "react";
import InquiriesListClient from "./InquiriesListClient";

export const dynamic = "force-dynamic"; // (선택) 프리렌더 회피

export default function Page() {
  return (
    <Suspense fallback={<div>로딩중…</div>}>
      <InquiriesListClient />
    </Suspense>
  );
}
