// app/admin/(console)/content/market/[id]/edit/page.tsx
import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";
import { getOne } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function EditPage({
  params,
}: {
  // Next.js 15 typed routes: params는 Promise
  params: Promise<{ id: string }>;
}) {
  const section: Section = "market";
  const { id } = await params;

  // API fetch 대신 서버에서 직접 조회
  const item = getOne(section, id);
  if (!item) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item as ContentItem} />
    </div>
  );
}
