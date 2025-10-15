"use client";

import { useEffect, useMemo, useState } from "react";
import type { Member } from "@/lib/members";
import { MEMBER_DEFAULTS } from "@/lib/members";

type Props = {
  initial?: Member | null;
  onSaved?: (m: Member) => void;
};

export default function MemberForm({ initial, onSaved }: Props) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Member>>({
    ...MEMBER_DEFAULTS,
    ...initial,
  });

  useEffect(() => {
    setForm({ ...MEMBER_DEFAULTS, ...initial });
  }, [initial]);

  const canSubmit = useMemo(() => {
    return !!form.name && !!form.email && !saving;
  }, [form, saving]);

  // ✅ 키에 맞는 정확한 값 타입을 강제
  const update = <K extends keyof Member>(k: K, v: Member[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setErr(null);

    try {
      const payload = {
        name: form.name?.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim() || undefined,
        group: form.group?.trim() || undefined,
        role: form.role,
        status: form.status,
        subscribed: !!form.subscribed,
        memo: form.memo?.trim() || undefined,
      };

      const res = await fetch(
        isEdit ? `/api/admin/members/${initial!.id}` : "/api/admin/members",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || "저장에 실패했습니다");
      }
      const saved: Member = await res.json();
      onSaved?.(saved);

      if (!isEdit) setForm({ ...MEMBER_DEFAULTS });
      alert("저장 완료!");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "에러가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {err && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{err}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">이름 *</span>
          <input
            className="border rounded-lg px-3 py-2"
            value={form.name || ""}
            onChange={(e) => update("name", e.target.value)}
            placeholder="홍길동"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">이메일 *</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2"
            value={form.email || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="user@example.com"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">휴대폰</span>
          <input
            className="border rounded-lg px-3 py-2"
            value={form.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="010-1234-5678"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">그룹</span>
          <input
            className="border rounded-lg px-3 py-2"
            value={form.group || ""}
            onChange={(e) => update("group", e.target.value)}
            placeholder="예: 기업회원 / 내부 / 외부파트너"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">권한</span>
          <select
            className="border rounded-lg px-3 py-2"
            value={form.role || "viewer"}
            onChange={(e) => update("role", e.target.value as Member["role"])}
          >
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">상태</span>
          <select
            className="border rounded-lg px-3 py-2"
            value={form.status || "active"}
            onChange={(e) =>
              update("status", e.target.value as Member["status"])
            }
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={!!form.subscribed}
            onChange={(e) => update("subscribed", e.target.checked)}
          />
          <span className="text-sm text-gray-700">구독 동의</span>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">메모</span>
        <textarea
          className="border rounded-lg px-3 py-2 min-h-[100px]"
          value={form.memo || ""}
          onChange={(e) => update("memo", e.target.value)}
          placeholder="특이사항, 내부 메모 등"
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
