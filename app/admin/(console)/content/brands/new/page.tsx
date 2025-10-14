"use client";
import ContentForm from "@/components/admin/content/ContentForm";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const router = useRouter();
  const section = "brands"; // data365 / market / consumer / brands / media / global / resource
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 글 등록</h1>
      <ContentForm section={section as any} onSaved={(id)=>router.replace(`/admin/content/${section}/${id}/edit`)} />
    </div>
  );
}
