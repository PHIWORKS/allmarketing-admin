"use client";

import { useEffect, useMemo, useState } from "react";

type Subscriber = {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed" | "bounced" | "complained";
  source: "web" | "import" | "admin";
  tags: string[];
  joinedAt: string;
  lastActivityAt?: string | null;
};

type ListResp = { total: number; rows: Subscriber[] };

export default function SubscribersPage() {
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ListResp>({ total: 0, rows: [] });

  // 폼 (생성/수정)
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const qs = new URLSearchParams({
      q,
      status,
      page: String(page),
      size: "10",
    });
    const res = await fetch(`/api/admin/subscribers?${qs.toString()}`);
    const data = (await res.json()) as ListResp;
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((list.total || 0) / 10)),
    [list.total]
  );

  const onCreate = () => {
    setEditing({
      id: "",
      email: "",
      name: "",
      status: "active",
      source: "admin",
      tags: [],
      joinedAt: new Date().toISOString(),
      lastActivityAt: null,
    });
    setShowForm(true);
  };

  const onEdit = (s: Subscriber) => {
    setEditing(s);
    setShowForm(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    fetchList();
  };

  const handleSubmit = async (form: Subscriber) => {
    if (form.id) {
      await fetch(`/api/admin/subscribers/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/admin/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditing(null);
    fetchList();
  };

  const exportCSV = () => {
    const rows = [
      ["id", "email", "name", "status", "source", "tags", "joinedAt", "lastActivityAt"],
      ...list.rows.map((r) => [
        r.id,
        r.email,
        r.name ?? "",
        r.status,
        r.source,
        r.tags.join("|"),
        r.joinedAt,
        r.lastActivityAt ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">회원 관리 · 구독자 관리</h1>
          <p className="text-xs text-gray-500 mt-1">
            뉴스레터/알림 수신 동의를 받은 구독자를 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          >
            CSV로 내보내기
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            신규 구독자 추가
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="rounded-xl border bg-white p-3 flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-64"
          placeholder="이메일/이름 검색"
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              setQ((e.target as HTMLInputElement).value);
            }
          }}
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">상태 전체</option>
          <option value="active">active</option>
          <option value="unsubscribed">unsubscribed</option>
          <option value="bounced">bounced</option>
          <option value="complained">complained</option>
        </select>
      </div>

      {/* 표 */}
      <div className="rounded-2xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["이메일", "이름", "상태", "태그", "유입", "가입일", "최근 활동", "작업"].map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  로딩중…
                </td>
              </tr>
            )}
            {!loading &&
              list.rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.email}</td>
                  <td className="px-4 py-3">{r.name || "-"}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3 truncate max-w-[260px]">{r.tags.join(", ") || "-"}</td>
                  <td className="px-4 py-3">{r.source}</td>
                  <td className="px-4 py-3">{r.joinedAt.slice(0, 10)}</td>
                  <td className="px-4 py-3">{r.lastActivityAt ? r.lastActivityAt.slice(0, 10) : "-"}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button className="text-emerald-600 hover:underline" onClick={() => onEdit(r)}>
                      수정
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(r.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && list.rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
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
  initial: Subscriber;
  onClose: () => void;
  onSubmit: (s: Subscriber) => void;
}) {
  const [form, setForm] = useState<Subscriber>(initial);
  const [tagsText, setTagsText] = useState((initial.tags || []).join(", "));

  const update = (patch: Partial<Subscriber>) =>
    setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[680px] rounded-2xl bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {form.id ? "구독자 수정" : "신규 구독자 추가"}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            닫기
          </button>
        </div>

        <div className="grid gap-3">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">이메일</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="user@example.com"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">이름(선택)</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.name || ""}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="이름을 입력하세요"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-sm text-gray-600">상태</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.status}
                onChange={(e) =>
                  update({ status: e.target.value as Subscriber["status"] })
                }
              >
                <option value="active">active</option>
                <option value="unsubscribed">unsubscribed</option>
                <option value="bounced">bounced</option>
                <option value="complained">complained</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm text-gray-600">유입 경로</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.source}
                onChange={(e) =>
                  update({ source: e.target.value as Subscriber["source"] })
                }
              >
                <option value="web">web</option>
                <option value="import">import</option>
                <option value="admin">admin</option>
              </select>
            </label>
          </div>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">태그(쉼표로 구분)</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g. weekly, paid, vip"
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
                tags: tagsText
                  .split(",")
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
