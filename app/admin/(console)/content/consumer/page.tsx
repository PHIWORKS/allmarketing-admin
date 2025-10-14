import SectionList from "@/components/admin/content/SectionList";
import { Suspense } from "react";

export default function Page() {
  return <Suspense
      fallback={<div className="p-4 text-gray-500 text-sm">로딩중…</div>}
    >
      <SectionList section="market" />
    </Suspense>
}