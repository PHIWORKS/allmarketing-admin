// app/admin/(console)/content/brands/[id]/edit/page.tsx
import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";

export default async function EditPage({
  params,
}: {
  // ✅ Next 15 대응: params가 Promise일 수 있음
  params: Promise<{ id: string }> | { id: string };
}) {
  const section: Section = "brands";

  // ✅ Promise/객체 모두 커버
  const { id } = await Promise.resolve(params);

  // 서버 컴포넌트에선 상대 경로 fetch 사용 가능 (요청 시 실행)
  const res = await fetch(`/api/admin/content/${section}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // 빌드엔 영향 없게 런타임에서만 에러 처리
    throw new Error(`콘텐츠 로드 실패: ${res.status}`);
  }

  const item: ContentItem = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item} />
    </div>
  );
} 