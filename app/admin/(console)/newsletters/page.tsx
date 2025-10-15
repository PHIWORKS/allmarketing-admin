// app/admin/(console)/newsletters/page.tsx
"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Row = {
  id: string;
  title: string;
  subject: string;
  segment?: string;
  status: "draft" | "scheduled" | "sent";
  sendAt?: string | null;
  createdAt: string;
};

// ── 1) 기본 내보내기는 Suspense 래퍼 ─────────────────────────────
export default function NewsletterListPageWrapper() {
  return (
    <Suspense fallback={<div>필터를 불러오는 중…</div>}>
      <NewsletterListPageInner />
    </Suspense>
  );
}

// ── 2) 실제 훅 사용 컴포넌트(여기서 useSearchParams 사용) ───────
function NewsletterListPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ total: number; rows: Row[] }>({ total: 0, rows: [] });
  const [err, setErr] = useState<string | null>(null);

  const q = sp.get("q") || "";
  const status = sp.get("status") || "";
  const page = Number(sp.get("page") || "1");

  const setParam = (k: string, v: string) => {
    const params = new URLSearchParams(Array.from(sp.entries())); // Readonly → 복제
    if (!v) params.delete(k);
    else params.set(k, v);
    if (k !== "page") params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const qs = new URLSearchParams({ q, status, page: String(page), size: "10" });
        const res = await fetch(`/api/admin/newsletters?${qs.toString()}`);
        if (!res.ok) throw new Error("목록을 불러오지 못했습니다.");
        const j: { total: number; rows: Row[] } = await res.json();
        setData(j);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [q, status, page]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">뉴스레터 관리</h1>
          <p className="text-xs text-gray-500 mt-1">작성·예약·발송 상태를 한 눈에 관리합니다.</p>
        </div>
        <Link
          href="/admin/(console)/newsletters/new"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 뉴스레터 작성
        </Link>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="제목/제목행 검색"
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") setParam("q", (e.target as HTMLInputElement).value);
          }}
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="">상태 전체</option>
          <option value="draft">draft</option>
          <option value="scheduled">scheduled</option>
          <option value="sent">sent</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["제목", "제목행", "세그먼트", "상태", "예약시간", "작성일", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={7}>
                  로딩중…
                </td>
              </tr>
            )}
            {err && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-red-600" colSpan={7}>
                  {err}
                </td>
              </tr>
            )}
            {!loading &&
              !err &&
              data.rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.subject}</td>
                  <td className="px-4 py-3">{r.segment || "전체"}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">{r.sendAt ? r.sendAt.slice(0, 16).replace("T", " ") : "-"}</td>
                  <td className="px-4 py-3">{r.createdAt.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <Link
                      className="text-emerald-600 hover:underline"
                      href={`/admin/(console)/newsletters/${r.id}/edit`}
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            {!loading && !err && data.rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={7}>
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: Math.ceil((data.total || 0) / 10) || 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setParam("page", String(i + 1))}
            className={`px-3 py-1.5 rounded-lg border ${
              page === i + 1 ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
