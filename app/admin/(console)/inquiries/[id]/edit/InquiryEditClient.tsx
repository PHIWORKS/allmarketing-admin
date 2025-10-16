"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Inquiry, InquiryStatus } from "@/lib/inquiries.store";

export default function InquiryEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<Inquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/admin/inquiries/${id}`);
        if (!r.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const j: Inquiry = await r.json();
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
    const patch: Partial<Inquiry> = {
      status: (fd.get("status") as InquiryStatus) ?? item.status,
      memo: (fd.get("memo") as string) || undefined,
    };
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "저장 실패");
      }
      alert("저장되었습니다.");
      router.replace("/admin/(console)/inquiries");
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
      <h1 className="text-xl font-semibold">문의/자료요청 상세</h1>

      <div className="rounded-2xl border bg-white p-4 space-y-2">
        <div className="text-sm text-gray-500">기본 정보</div>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div><span className="text-gray-500">유형</span> : {item.type}</div>
          <div><span className="text-gray-500">상태</span> : {item.status}</div>
          <div><span className="text-gray-500">이름</span> : {item.name}</div>
          <div><span className="text-gray-500">이메일</span> : {item.email}</div>
          <div><span className="text-gray-500">회사</span> : {item.company || "-"}</div>
          <div><span className="text-gray-500">연락처</span> : {item.phone || "-"}</div>
          <div className="md:col-span-2"><span className="text-gray-500">제목</span> : {item.title}</div>
          <div className="md:col-span-2 whitespace-pre-wrap">
            <span className="text-gray-500">내용</span> : {item.message}
          </div>
          <div><span className="text-gray-500">등록</span> : {item.createdAt.replace("T"," ").slice(0,16)}</div>
          <div><span className="text-gray-500">수정</span> : {item.updatedAt.replace("T"," ").slice(0,16)}</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <label className="space-y-1">
            <div className="text-sm text-gray-600">상태 변경</div>
            <select name="status" defaultValue={item.status} className="w-full border rounded-lg px-3 py-2">
              <option value="new">new</option>
              <option value="in_progress">in_progress</option>
              <option value="answered">answered</option>
              <option value="closed">closed</option>
            </select>
          </label>
          <div className="md:col-span-2 space-y-1">
            <div className="text-sm text-gray-600">내부 메모</div>
            <textarea
              name="memo"
              defaultValue={item.memo || ""}
              className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
              placeholder="진행사항, 고객 응대 내용 등"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl border"
          >
            뒤로
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "저장중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
