// components/admin/system/FooterPageForm.tsx
"use client";

import { useState, useEffect } from "react";
import type { FooterPage } from "@/lib/footerPages.store";

type Props = {
  initial?: FooterPage | null;
  onSaved?: (val: FooterPage) => void;
};

export default function FooterPageForm({ initial, onSaved }: Props) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<FooterPage>>({
    slug: "/new-page",
    title: "",
    visible: true,
    order: 99,
    contentHtml: "",
    ...initial,
  });

  useEffect(() => {
    setForm({
      slug: "/new-page",
      title: "",
      visible: true,
      order: 99,
      contentHtml: "",
      ...initial,
    });
  }, [initial]);

  const update = <K extends keyof FooterPage>(k: K, v: FooterPage[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        slug: (form.slug || "").trim(),
        title: (form.title || "").trim(),
        visible: !!form.visible,
        order: Number(form.order ?? 99),
        contentHtml: form.contentHtml || "",
      };
      const res = await fetch(
        isEdit ? `/api/admin/system/footer-pages/${initial!.id}` : "/api/admin/system/footer-pages",
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
      const saved: FooterPage = await res.json();
      onSaved?.(saved);
      if (!isEdit) {
        setForm({ slug: "/new-page", title: "", visible: true, order: 99, contentHtml: "" });
      }
      alert("저장 완료!");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {err && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{err}</div>}

      <div className="grid md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm text-gray-600">슬러그(URL) *</span>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="/privacy"
            value={form.slug || ""}
            onChange={(e) => update("slug", e.target.value)}
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-gray-600">제목 *</span>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.title || ""}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">노출 여부</span>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.visible ? "true" : "false"}
            onChange={(e) => update("visible", e.target.value === "true")}
          >
            <option value="true">노출</option>
            <option value="false">숨김</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">정렬 순서(작을수록 위)</span>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.order ?? 99}
            onChange={(e) => update("order", Number(e.target.value))}
          />
        </label>

        <label className="md:col-span-2 space-y-1">
          <span className="text-sm text-gray-600">본문(HTML)</span>
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[160px]"
            value={form.contentHtml || ""}
            onChange={(e) => update("contentHtml", e.target.value)}
            placeholder="<h1>제목</h1><p>내용</p>"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "저장중…" : isEdit ? "수정 저장" : "신규 등록"}
        </button>
        <button type="button" className="px-4 py-2 rounded-xl border" onClick={() => history.back()}>
          뒤로
        </button>
      </div>
    </form>
  );
}
