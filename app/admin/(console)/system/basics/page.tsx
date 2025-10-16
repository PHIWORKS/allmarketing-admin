// app/admin/(console)/system/basics/page.tsx
import { getBasics } from "@/lib/system.store";
import BasicsForm from "@/components/admin/system/BasicsForm";

export const dynamic = "force-dynamic"; // 인메모리 갱신 시 SSR 재평가

export default async function SystemBasicsPage() {
  // 서버에서 바로 읽어서 초기값 주입(자기 API 호출 X → 빌드/런타임 안전)
  const initial = getBasics();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">시스템 관리 · 기본정보</h1>
      <p className="text-xs text-gray-500">
        사이트 기본정보, 연락처, 회사정보, SNS, 푸터 설정을 관리합니다.
      </p>
      <BasicsForm initial={initial} />
    </div>
  );
}
