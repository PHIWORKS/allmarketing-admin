import { Suspense } from "react";
import AdminLoginPage from "@/components/admin/login/AdminLoginPage"; // 현재 파일을 이동했다면 경로 조정
export const dynamic = "force-dynamic"; // ✅ 정적 빌드 대신 SSR 강제

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500 text-sm">로딩중…</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}