// app/admin/(console)/content/data365/[id]/edit/page.tsx
import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";
import { getOne } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function EditPage({
  params,
}: {
  // Next.js 15 typed routes: Promise로 받기
  params: Promise<{ id: string }>;
}) {
  const section: Section = "data365";
  const { id } = await params;

  // API fetch 대신 메모리 스토어를 직접 조회 (서버 환경에서 안전)
  const item = getOne(section, id);
  if (!item) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      {/* 서버 컴포넌트에서는 함수 prop을 넘기지 않음 */}
      <ContentForm section={section} initial={item as ContentItem} />
    </div>
  );
}
