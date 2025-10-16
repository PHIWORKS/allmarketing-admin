// components/admin/system/BasicsForm.tsx
"use client";

import { useEffect, useState } from "react";
import type { SystemBasics } from "@/lib/system.store";

type Props = {
  initial: SystemBasics;
  onSaved?: (val: SystemBasics) => void;
};

export default function BasicsForm({ initial, onSaved }: Props) {
  const [form, setForm] = useState<SystemBasics>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const update = <K extends keyof SystemBasics>(key: K, val: SystemBasics[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const updateSns = (k: keyof NonNullable<SystemBasics["sns"]>, v: string) => {
    setForm((f) => ({ ...f, sns: { ...(f.sns ?? {}), [k]: v } }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/system/basics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "저장에 실패했습니다");
      }
      const saved: SystemBasics = await res.json();
      setForm(saved);
      onSaved?.(saved);
      alert("저장 완료!");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {err && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{err}</div>}

      {/* 기본정보 */}
      <section className="rounded-2xl border bg-white p-4 space-y-3">
        <h2 className="font-semibold">기본정보</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">사이트명 *</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">사이트 태그라인</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.siteTagline ?? ""}
              onChange={(e) => update("siteTagline", e.target.value)}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">로고 URL</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
              value={form.logoUrl ?? ""}
              onChange={(e) => update("logoUrl", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">파비콘 URL</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
              value={form.faviconUrl ?? ""}
              onChange={(e) => update("faviconUrl", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* 연락/회사정보 */}
      <section className="rounded-2xl border bg-white p-4 space-y-3">
        <h2 className="font-semibold">연락/회사정보</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">대표 이메일 *</span>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">대표 전화</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.contactPhone ?? ""}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-gray-600">주소</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.address ?? ""}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">사업자등록번호</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.businessNo ?? ""}
              onChange={(e) => update("businessNo", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">개인정보보호책임자</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.privacyOfficer ?? ""}
              onChange={(e) => update("privacyOfficer", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* SNS 링크 */}
      <section className="rounded-2xl border bg-white p-4 space-y-3">
        <h2 className="font-semibold">SNS 링크</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">YouTube</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://youtube.com/..."
              value={form.sns?.youtube ?? ""}
              onChange={(e) => updateSns("youtube", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">Instagram</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://instagram.com/..."
              value={form.sns?.instagram ?? ""}
              onChange={(e) => updateSns("instagram", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">X (Twitter)</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://x.com/..."
              value={form.sns?.x ?? ""}
              onChange={(e) => updateSns("x", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">블로그</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://blog...."
              value={form.sns?.blog ?? ""}
              onChange={(e) => updateSns("blog", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-gray-600">LinkedIn</span>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://linkedin.com/company/..."
              value={form.sns?.linkedin ?? ""}
              onChange={(e) => updateSns("linkedin", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* 푸터 HTML */}
      <section className="rounded-2xl border bg-white p-4 space-y-3">
        <h2 className="font-semibold">푸터 HTML</h2>
        <textarea
          className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
          value={form.footerHtml ?? ""}
          onChange={(e) => update("footerHtml", e.target.value)}
          placeholder="푸터에 들어갈 HTML을 입력하세요."
        />
        <div className="text-xs text-gray-500">
          마지막 저장: {new Date(form.updatedAt).toLocaleString()}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "저장중…" : "저장"}
        </button>
      </div>
    </form>
  );
}
