import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";

export default async function EditPage({
  params,
}: {
  // ✅ 반드시 Promise로 선언 (PageProps의 제약을 만족)
  params: Promise<{ id: string }>;
}) {
  const section: Section = "brands";
  const { id } = await params; // ✅ Promise 해제

  const res = await fetch(`/api/admin/content/${section}/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
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