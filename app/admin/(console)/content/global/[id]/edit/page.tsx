"use client";

import { useEffect, useState } from "react";
import ContentForm from "@/components/admin/content/ContentForm";
import type { ContentItem, Section } from "@/lib/content";

export default function EditPage({ params }: { params: { id: string } }) {
  const section: Section = "global";
  const [item, setItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetch(`/api/admin/content/${section}/${params.id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [params.id, section]);

  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">콘텐츠 수정</h1>
      <ContentForm section={section} initial={item} onSaved={() => location.reload()} />
    </div>
  );
}
