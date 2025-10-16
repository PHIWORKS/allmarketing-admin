"use client";

import { useMemo, useState } from "react";
import type { AdminAccount, AdminRole, AdminStatus } from "@/lib/adminAccounts.store";

type Props = {
  initial?: AdminAccount | null;
  onSaved?: (a: AdminAccount) => void;
};

const ROLES: AdminRole[] = ["owner", "manager", "editor", "viewer"];
const STATUSES: AdminStatus[] = ["active", "suspended"];

export default function AdminAccountForm({ initial, onSaved }: Props) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<AdminAccount>>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "viewer",
    status: initial?.status ?? "active",
    memo: initial?.memo ?? "",
  });

  const canSubmit = useMemo(() => {
    return !!form.name && !!form.email && !!form.role && !!form.status && !saving;
  }, [form, saving]);

  const update = <K extends keyof AdminAccount>(k: K, v: AdminAccount[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: (form.name ?? "").trim(),
        email: (form.email ?? "").trim(),
        role: form.role as AdminRole,
        status: form.status as AdminStatus,
        memo: form.memo?.trim() || undefined,
      };

      const res = await fetch(
        isEdit ? `/api/admin/system/admins/${initial!.id}` : "/api/admin/system/admins",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "저장 실패");
      }
      const saved: AdminAccount = await res.json();
      onSaved?.(saved);
      alert("저장되었습니다.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      {err && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">이름 *</span>
          <input
            className="border rounded-lg px-3 py-2"
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            required
            placeholder="홍길동"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">이메일 *</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2"
            value={form.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            required
            placeholder="admin@example.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">역할(Role)</span>
          <select
            className="border rounded-lg px-3 py-2"
            value={(form.role as AdminRole) ?? "viewer"}
            onChange={(e) => update("role", e.target.value as AdminRole)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">상태(Status)</span>
          <select
            className="border rounded-lg px-3 py-2"
            value={(form.status as AdminStatus) ?? "active"}
            onChange={(e) => update("status", e.target.value as AdminStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">메모</span>
        <textarea
          className="border rounded-lg px-3 py-2 min-h-[100px]"
          value={form.memo ?? ""}
          onChange={(e) => update("memo", e.target.value)}
          placeholder="내부 메모"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-xl text-white ${
            saving ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isEdit ? "수정 저장" : "신규 등록"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => history.back()}
          className="px-4 py-2 rounded-xl border"
        >
          뒤로
        </button>
      </div>
    </form>
  );
}
