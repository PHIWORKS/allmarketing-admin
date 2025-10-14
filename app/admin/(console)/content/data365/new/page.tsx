"use client";

import ContentForm from "@/components/admin/content/ContentForm";
import { useRouter } from "next/navigation";
import type { Section } from "@/lib/content";

export default function NewPage() {
  const router = useRouter();
  const section: Section = "market";
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 글 등록</h1>
      <ContentForm
        section={section}
        onSaved={(id) => router.replace(`/admin/(console)/content/${section}/${id}/edit`)}
      />
    </div>
  );
}
