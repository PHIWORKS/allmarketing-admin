"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Section, ContentItem } from "@/lib/content";
import { SECTION_LABEL } from "@/lib/content";

type ApiListResponse = { total: number; rows: ContentItem[] };

export default function SectionList({ section }: { section: Section }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [data, setData] = useState<ApiListResponse>({ total: 0, rows: [] });
  const [loading, setLoading] = useState(false);

  const q = sp.get("q") || "";
  const status = sp.get("status") || "";
  const access = sp.get("access") || "";
  const page = Number(sp.get("page") || "1");

  const fetchList = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({
      q,
      status,
      access,
      page: String(page),
      size: "10",
    });
    const res = await fetch(`/api/admin/content/${section}?${qs}`);
    const j: ApiListResponse = await res.json();
    setData(j);
    setLoading(false);
  }, [q, status, access, page, section]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const setParam = (k: string, v: string) => {
    // ❌ sp as any → ✅ 문자열로 복제해 안전하게 생성
    const params = new URLSearchParams(sp.toString());
    if (!v) params.delete(k);
    else params.set(k, v);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">콘텐츠 관리 · {SECTION_LABEL[section]}</h1>
          <p className="text-xs text-gray-500 mt-1">검색/필터 후 우측 상단에서 새 글을 등록하세요.</p>
        </div>
        <Link
          href={`/admin/content/${section}/new`}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 글 등록
        </Link>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="키워드 검색"
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
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2"
          value={access}
          onChange={(e) => setParam("access", e.target.value)}
        >
          <option value="">공개범위 전체</option>
          <option value="everyone">everyone</option>
          <option value="members">members</option>
          <option value="paid">paid</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["제목", "카테고리", "공개범위", "상태", "작성자", "작성일", "조회수", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={8}>
                  로딩중…
                </td>
              </tr>
            )}
            {!loading &&
              data.rows.map((r: ContentItem) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.categories?.[0] || "-"}</td>
                  <td className="px-4 py-3">{r.accessScope}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">{r.createdBy}</td>
                  <td className="px-4 py-3">{r.createdAt.slice(0, 10)}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 200)}</td>
                  <td className="px-4 py-3">
                    <Link
                      className="text-emerald-600 hover:underline"
                      href={`/admin/content/${section}/${r.id}/edit`}
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            {!loading && data.rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={8}>
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: Math.ceil(data.total / 10) || 1 }).map((_, i) => (
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
