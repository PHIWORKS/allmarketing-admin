"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  title: string;
  place: string;
  status: string;
  priority: number;
  startAt?: string | null;
  endAt?: string | null;
  createdAt: string;
};

export default function BannerListPage() {
  const [data, setData] = useState<{ total: number; rows: Row[] }>({ total: 0, rows: [] });
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [place, setPlace] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const qs = new URLSearchParams({
        q, status, place, page: String(page), size: "10",
      });
      const res = await fetch(`/api/admin/banners?${qs}`);
      const j = await res.json();
      setData(j);
      setLoading(false);
    })();
  }, [q, status, place, page]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">배너 관리</h1>
          <p className="text-xs text-gray-500 mt-1">배너를 등록/수정하고 노출 우선순위를 관리하세요.</p>
        </div>
        <Link href="/admin/banners/new"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
          새 배너 등록
        </Link>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 grid md:grid-cols-4 gap-2">
        <input className="border rounded-lg px-3 py-2"
               placeholder="제목 검색"
               onKeyDown={(e)=>{ if(e.key==="Enter") setQ((e.target as HTMLInputElement).value); }} />
        <select className="border rounded-lg px-3 py-2" value={status} onChange={(e)=>{ setPage(1); setStatus(e.target.value);}}>
          <option value="">상태 전체</option>
          <option value="draft">draft</option>
          <option value="active">active</option>
          <option value="scheduled">scheduled</option>
          <option value="archived">archived</option>
        </select>
        <select className="border rounded-lg px-3 py-2" value={place} onChange={(e)=>{ setPage(1); setPlace(e.target.value);}}>
          <option value="">위치 전체</option>
          <option value="home_top">홈 상단</option>
          <option value="home_middle">홈 중단</option>
          <option value="home_bottom">홈 하단</option>
          <option value="section_sidebar">섹션 사이드바</option>
          <option value="popup">팝업</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
          <tr className="text-left text-gray-500 border-b">
            {["제목","위치","상태","우선순위","게시기간","등록일","작업"].map((c)=>(
              <th key={c} className="px-4 py-2.5 font-medium">{c}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">로딩중…</td></tr>}
          {!loading && data.rows.map((r)=>(
            <tr key={r.id} className="border-t">
              <td className="px-4 py-3">{r.title}</td>
              <td className="px-4 py-3">{r.place}</td>
              <td className="px-4 py-3">{r.status}</td>
              <td className="px-4 py-3">{r.priority}</td>
              <td className="px-4 py-3">
                {(r.startAt?.slice(0,16) || "-")} ~ {(r.endAt?.slice(0,16) || "-")}
              </td>
              <td className="px-4 py-3">{r.createdAt.slice(0,10)}</td>
              <td className="px-4 py-3">
                <Link className="text-emerald-600 hover:underline"
                      href={`/admin/banners/${r.id}/edit`}>수정</Link>
              </td>
            </tr>
          ))}
          {!loading && data.rows.length===0 && (
            <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">데이터가 없습니다</td></tr>
          )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: Math.ceil((data.total||0)/10)||1 }).map((_,i)=>(
          <button key={i}
                  onClick={()=>setPage(i+1)}
                  className={`px-3 py-1.5 rounded-lg border ${page===i+1?"bg-gray-900 text-white":"bg-white"}`}>
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}
