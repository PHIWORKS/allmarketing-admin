"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Inquiry, InquiryStatus } from "@/lib/inquiries.store";

export default function InquiriesListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ total: number; rows: Inquiry[] }>({ total: 0, rows: [] });
  const [err, setErr] = useState<string | null>(null);

  const q = sp.get("q") || "";
  const status = (sp.get("status") || "") as InquiryStatus | "";
  const page = Number(sp.get("page") || "1");

  const setParam = (k: string, v: string) => {
    const params = new URLSearchParams(Array.from(sp.entries()));
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
        const qs = new URLSearchParams({
          q,
          status,
          page: String(page),
          size: "10",
        });
        const res = await fetch(`/api/admin/inquiries?${qs.toString()}`);
        if (!res.ok) throw new Error("목록을 불러오지 못했습니다.");
        const j = (await res.json()) as { total: number; rows: Inquiry[] };
        setData(j);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [q, status, page]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">문의/자료요청 관리</h1>
          <p className="text-xs text-gray-500 mt-1">유입된 문의와 자료요청을 조회하고 상태를 변경하세요.</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="이름/이메일/제목 검색"
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
          <option value="new">new</option>
          <option value="in_progress">in_progress</option>
          <option value="answered">answered</option>
          <option value="closed">closed</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["유형", "제목", "이름/이메일", "상태", "등록일", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-center text-gray-400" colSpan={6}>로딩중…</td></tr>
            )}
            {err && !loading && (
              <tr><td className="px-4 py-6 text-center text-red-600" colSpan={6}>{err}</td></tr>
            )}
            {!loading && !err && data.rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">
                  {r.name} <span className="text-gray-500">/ {r.email}</span>
                </td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.createdAt.slice(0,10)}</td>
                <td className="px-4 py-3">
                  <Link
                    className="text-emerald-600 hover:underline"
                    href={`/admin/inquiries/${r.id}/edit`}
                  >
                    보기/수정
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && !err && data.rows.length === 0 && (
              <tr><td className="px-4 py-6 text-center text-gray-400" colSpan={6}>데이터가 없습니다</td></tr>
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
            className={`px-3 py-1.5 rounded-lg border ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
