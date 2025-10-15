// app/admin/(console)/members/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Row = {
  id: string;
  name: string;
  email: string;
  group?: string;
  role: "admin" | "analyst" | "viewer";
  status: "active" | "invited" | "suspended";
  joinedAt: string;
  lastLoginAt?: string | null;
};

export default function MemberListPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ total: number; rows: Row[] }>({ total: 0, rows: [] });

  const q = sp.get("q") || "";
  const status = sp.get("status") || "";
  const group = sp.get("group") || "";
  const page = Number(sp.get("page") || "1");

  const setParam = (k: string, v: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!v) params.delete(k);
    else params.set(k, v);
    if (k !== "page") params.set("page", "1"); // 필터 바뀌면 1페이지로
    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const qs = new URLSearchParams({
        q,
        status,
        group,
        page: String(page),
        size: "10",
      });
      const res = await fetch(`/api/admin/members?${qs}`);
      const j = await res.json();
      setData(j);
      setLoading(false);
    })();
  }, [q, status, group, page]);

  // 현재 목록의 쿼리스트링을 from으로 같이 넘겨서 편집 후 돌아오면 그대로 복원
  const fromQS = useMemo(() => {
    const params = new URLSearchParams(sp.toString());
    return params.toString(); // e.g. "q=abc&status=active&page=2"
  }, [sp]);

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">회원 관리 · 회원 목록</h1>
          <p className="text-xs text-gray-500 mt-1">검색/필터 후 우측에서 신규 초대를 진행하세요.</p>
        </div>
        <Link
          href="/admin/members/new"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 회원 초대
        </Link>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="이름/이메일 검색"
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
          <option value="active">active</option>
          <option value="invited">invited</option>
          <option value="suspended">suspended</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2"
          value={group}
          onChange={(e) => setParam("group", e.target.value)}
        >
          <option value="">그룹 전체</option>
          <option value="기본">기본</option>
          <option value="리서치">리서치</option>
          <option value="마케팅">마케팅</option>
          <option value="외부협력">외부협력</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["이름", "이메일", "그룹", "역할", "상태", "가입일", "최근 접속", "작업"].map((c) => (
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
              data.rows.map((r) => {
                const editHref = `/admin/members/${encodeURIComponent(
                  r.id
                )}/edit${fromQS ? `?from=${encodeURIComponent(fromQS)}` : ""}`;
                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.group || "-"}</td>
                    <td className="px-4 py-3">{r.role}</td>
                    <td className="px-4 py-3">{r.status}</td>
                    <td className="px-4 py-3">{r.joinedAt.slice(0, 10)}</td>
                    <td className="px-4 py-3">{r.lastLoginAt ? r.lastLoginAt.slice(0, 10) : "-"}</td>
                    <td className="px-4 py-3">
                      <Link className="text-emerald-600 hover:underline" href={editHref}>
                        수정
                      </Link>
                    </td>
                  </tr>
                );
              })}
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
