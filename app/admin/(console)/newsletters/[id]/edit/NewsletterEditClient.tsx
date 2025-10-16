"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  subject: string;
  segment?: string;
  status: "draft" | "scheduled" | "sent";
  sendAt?: string | null;
  body: string;
  createdAt: string;
};

export default function NewsletterEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/admin/newsletters/${id}`);
        if (!r.ok) throw new Error("뉴스레터를 불러오지 못했습니다.");
        const j: Item = await r.json();
        if (alive) setItem(j);
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "알 수 없는 오류");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item) return;

    const fd = new FormData(e.currentTarget);
    const patch: Partial<Item> = {
      title: (fd.get("title") as string) ?? "",
      subject: (fd.get("subject") as string) ?? "",
      segment: ((fd.get("segment") as string) || undefined),
      status: ((fd.get("status") as Item["status"]) || "draft"),
      sendAt: ((fd.get("sendAt") as string) || null),
      body: (fd.get("body") as string) ?? "",
    };

    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/newsletters/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "수정 실패");
      }
      alert("수정되었습니다.");
      // 목록으로 돌아가거나, 현재 페이지 갱신 중 선택
      router.replace("/admin/newsletters");
      // 또는 router.refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">뉴스레터 수정</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            name="title"
            defaultValue={item.title}
            className="border rounded-lg px-3 py-2"
            placeholder="제목"
            required
          />
          <input
            name="subject"
            defaultValue={item.subject}
            className="border rounded-lg px-3 py-2"
            placeholder="제목행(Subject)"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <select
            name="segment"
            defaultValue={item.segment || ""}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">세그먼트: 전체</option>
            <option value="구독자">구독자</option>
            <option value="멤버">멤버</option>
          </select>

          <select
            name="status"
            defaultValue={item.status}
            className="border rounded-lg px-3 py-2"
          >
            <option value="draft">draft</option>
            <option value="scheduled">scheduled</option>
            <option value="sent">sent</option>
          </select>

          <input
            type="datetime-local"
            name="sendAt"
            defaultValue={item.sendAt ? item.sendAt.slice(0, 16) : ""}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <textarea
          name="body"
          rows={14}
          defaultValue={item.body}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="HTML/텍스트 본문"
        />

        <button
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "저장중…" : "저장"}
        </button>
      </form>
    </div>
  );
}
