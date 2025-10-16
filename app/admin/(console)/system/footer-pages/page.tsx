// app/admin/(console)/system/footer-pages/page.tsx
import Link from "next/link";
import { listFooterPages } from "@/lib/footerPages.store";

export const dynamic = "force-dynamic";

export default async function FooterPagesListPage() {
  const rows = listFooterPages();

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">시스템 관리 · 하단메뉴</h1>
          <p className="text-xs text-gray-500 mt-1">푸터에 노출될 정적 페이지를 관리합니다.</p>
        </div>
        <Link
          href="/admin/system/footer-pages/new"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 페이지
        </Link>
      </div>

      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["제목", "슬러그", "노출", "정렬", "수정일", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={6}>
                  데이터가 없습니다
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.slug}</td>
                <td className="px-4 py-3">{r.visible ? "노출" : "숨김"}</td>
                <td className="px-4 py-3">{r.order}</td>
                <td className="px-4 py-3">{r.updatedAt.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-3">
                  <Link
                    className="text-emerald-600 hover:underline"
                    href={`/admin/system/footer-pages/${encodeURIComponent(r.id)}/edit`}
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
