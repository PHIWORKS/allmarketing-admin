// app/admin/(console)/content/brands/[id]/edit/page.tsx
import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";
import { getOne } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>; // 섹션은 폴더가 고정이므로 받지 않음
}) {
  const { id } = await params;
  const section: Section = "brands"; // ✅ 고정

  const item = getOne(section, id);
  if (!item) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item as ContentItem} />
    </div>
  );
}
