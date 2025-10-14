import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";

export default async function EditPage({ params }: { params: { id: string } }) {
  const section: Section = "brands";
  const res = await fetch(`/api/admin/content/${section}/${params.id}`, { cache: "no-store" });
  const item: ContentItem = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item} />
    </div>
  );
}