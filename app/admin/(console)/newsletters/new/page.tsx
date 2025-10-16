"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewsletterNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title") as string,
      subject: fd.get("subject") as string,
      segment: (fd.get("segment") as string) || undefined,
      status: (fd.get("status") as "draft" | "scheduled" | "sent") || "draft",
      sendAt: (fd.get("sendAt") as string) || null,
      body: fd.get("body") as string,
    };
    setSaving(true);
    const res = await fetch("/api/admin/newsletters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) router.replace(`/admin/newsletters/${j.id}/edit`);
    else alert(j.error || "저장 실패");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 뉴스레터 작성</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="title" className="border rounded-lg px-3 py-2" placeholder="내부용 제목" required />
          <input name="subject" className="border rounded-lg px-3 py-2" placeholder="이메일 제목행(Subject)" required />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <select name="segment" className="border rounded-lg px-3 py-2">
            <option value="">세그먼트: 전체</option>
            <option value="구독자">구독자</option>
            <option value="멤버">멤버</option>
          </select>
          <select name="status" defaultValue="draft" className="border rounded-lg px-3 py-2">
            <option value="draft">draft</option>
            <option value="scheduled">scheduled</option>
            <option value="sent">sent</option>
          </select>
          <input type="datetime-local" name="sendAt" className="border rounded-lg px-3 py-2" />
        </div>
        <textarea name="body" rows={14} className="w-full border rounded-lg px-3 py-2" placeholder="콘텐츠(HTML/Markdown 모두 가능)"></textarea>
        <button disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
          {saving ? "저장중…" : "저장"}
        </button>
      </form>
    </div>
  );
}
