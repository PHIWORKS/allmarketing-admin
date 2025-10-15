"use client";

import { useEffect, useMemo, useState } from "react";

type Group = {
  id: string;
  name: string;
  description?: string;
  roleDefault: "viewer" | "analyst" | "admin";
  permissions: string[];         // ex) ["content:write", "members:read"]
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

type ListResp = { total: number; rows: Group[] };

export default function GroupListPage() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ListResp>({ total: 0, rows: [] });

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // 폼(생성/수정)
  const [editing, setEditing] = useState<Group | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const qs = new URLSearchParams({ q, page: String(page), size: "10" });
    const res = await fetch(`/api/admin/member-groups?${qs.toString()}`);
    const data = (await res.json()) as ListResp;
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((list.total || 0) / 10)),
    [list.total]
  );

  const onCreate = () => {
    setEditing({
      id: "",
      name: "",
      description: "",
      roleDefault: "viewer",
      permissions: [],
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowForm(true);
  };

  const onEdit = (g: Group) => {
    setEditing(g);
    setShowForm(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await fetch(`/api/admin/member-groups/${id}`, { method: "DELETE" });
    fetchList();
  };

  const handleSubmit = async (form: Group) => {
    if (form.id) {
      await fetch(`/api/admin/member-groups/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/member-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditing(null);
    fetchList();
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">회원 관리 · 권한 그룹 관리</h1>
          <p className="text-xs text-gray-500 mt-1">
            팀/조직 단위로 접근 권한을 그룹으로 관리하세요.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          새 그룹 만들기
        </button>
      </div>

      {/* 검색 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="그룹명 검색"
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") setQ((e.target as HTMLInputElement).value);
          }}
        />
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["그룹명", "기본 역할", "권한 수", "멤버 수", "생성일", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  로딩중…
                </td>
              </tr>
            )}
            {!loading &&
              list.rows.map((g) => (
                <tr key={g.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{g.name}</div>
                    {g.description && (
                      <div className="text-gray-500">{g.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">{g.roleDefault}</td>
                  <td className="px-4 py-3">{g.permissions.length}</td>
                  <td className="px-4 py-3">{g.memberCount}</td>
                  <td className="px-4 py-3">{g.createdAt.slice(0, 10)}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      className="text-emerald-600 hover:underline"
                      onClick={() => onEdit(g)}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(g.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && list.rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1.5 rounded-lg border ${
              page === i + 1 ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 폼 모달(심플) */}
      {showForm && editing && (
        <FormModal
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function FormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial: Group;
  onClose: () => void;
  onSubmit: (g: Group) => void;
}) {
  const [form, setForm] = useState<Group>(initial);
  const [permText, setPermText] = useState<string>(initial.permissions.join("\n"));

  const update = (patch: Partial<Group>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[680px] rounded-2xl bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {form.id ? "그룹 수정" : "새 그룹 만들기"}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            닫기
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">그룹명</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="예) 리서치팀"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">설명(선택)</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.description || ""}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="그룹 설명을 입력하세요"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">기본 역할</span>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.roleDefault}
              onChange={(e) =>
                update({ roleDefault: e.target.value as Group["roleDefault"] })
              }
            >
              <option value="viewer">viewer</option>
              <option value="analyst">analyst</option>
              <option value="admin">admin</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">권한 (줄바꿈으로 구분)</span>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-40"
              value={permText}
              onChange={(e) => setPermText(e.target.value)}
              placeholder={"예)\ncontent:read\ncontent:write\nmembers:read"}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>
            취소
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
            onClick={() =>
              onSubmit({
                ...form,
                permissions: permText
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
