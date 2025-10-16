import Link from "next/link";
import { listAdminAccounts } from "@/lib/adminAccounts.store";

export const dynamic = "force-dynamic";

export default async function AdminAccountsListPage() {
  const rows = listAdminAccounts();

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">시스템 관리 · 관리자계정</h1>
          <p className="text-xs text-gray-500 mt-1">관리자 계정을 관리합니다.</p>
        </div>
        <Link
          href="/admin/system/admins/new"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 관리자 등록
        </Link>
      </div>

      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["이름", "이메일", "역할", "상태", "최근접속", "수정일", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={7}>
                  데이터가 없습니다
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.role}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.lastLoginAt ? r.lastLoginAt.slice(0,16).replace("T"," ") : "-"}</td>
                <td className="px-4 py-3">{r.updatedAt.slice(0,16).replace("T"," ")}</td>
                <td className="px-4 py-3">
                  <Link
                    className="text-emerald-600 hover:underline"
                    href={`/admin/system/admins/${r.id}/edit`}
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
