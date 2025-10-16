"use client";

import { useState } from "react";
import type { FamilySite } from "@/lib/familySites.store";

type Props = {
  initial?: Partial<FamilySite>;
  onSaved?: (item: FamilySite) => void;
};

export default function FamilySiteForm({ initial, onSaved }: Props) {
  const [form, setForm] = useState<Partial<FamilySite>>({
    name: "",
    url: "https://",
    visible: true,
    order: 99,
    ...initial,
  });
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initial?.id);

  const save = async () => {
    setSaving(true);
    const res = await fetch(
      isEdit
        ? `/api/admin/system/family-sites/${encodeURIComponent(String(initial!.id))}`
        : "/api/admin/system/family-sites",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "저장 실패");
      return;
    }
    const saved: FamilySite = await res.json();
    onSaved?.(saved);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm text-gray-600">이름</div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="표시명"
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">URL</div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.url || ""}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://..."
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">정렬</div>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.order ?? 99}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={!!form.visible}
            onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
          />
          <span className="text-sm text-gray-700">노출</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "저장중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
