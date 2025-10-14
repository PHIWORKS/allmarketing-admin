"use client";
import ContentForm from "@/components/admin/content/ContentForm";
import { useRouter } from "next/navigation";
import { Section } from "@/lib/content"; // Assuming the type is defined in lib/content.ts

export default function NewPage() {
  const router = useRouter();
  const section: Section = "brands"; // data365 / market / consumer / brands / media / global / resource
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 글 등록</h1>
      <ContentForm section={section} onSaved={(id)=>router.replace(`/admin/content/${section}/${id}/edit`)} />
    </div>
  );
}
