import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ 반드시 Promise
}) {
  const section: Section = "global";

  const { id } = await params;  

  const res = await fetch(`/api/admin/content/${section}/${id}`, {
    cache: "no-store",
  });

  const item: ContentItem = await res.json();

  if (!res) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item} onSaved={() => location.reload()} />
    </div>
  );
}
