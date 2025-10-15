// components/admin/banners/BannerForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/banners.store";

type Props = {
  initial?: Partial<Banner>;
  onSaved?: (item: Banner) => void;
};

// 유니온 타입을 Banner에서 안전하게 가져와 사용
type Place = Banner["place"];
type LinkTarget = Banner["linkTarget"];
type Status = Banner["status"];

export default function BannerForm({ initial, onSaved }: Props) {
  const [form, setForm] = useState<Partial<Banner>>({
    title: "",
    place: "home_top",
    imageUrl: "",
    linkUrl: "",
    linkTarget: "_self",
    status: "draft",
    priority: 10,
    startAt: "",
    endAt: "",
    ...initial,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const isEdit = Boolean(initial?.id);
    const url = isEdit ? `/api/admin/banners/${initial!.id}` : "/api/admin/banners";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j: Banner = await res.json();
    setSaving(false);
    onSaved?.(j);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm text-gray-600">제목</div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.title || ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="배너 제목"
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">위치</div>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={(form.place ?? "home_top") as Place}
            onChange={(e) =>
              setForm((f) => ({ ...f, place: e.target.value as Place }))
            }
          >
            <option value="home_top">홈 상단</option>
            <option value="home_middle">홈 중단</option>
            <option value="home_bottom">홈 하단</option>
            <option value="section_sidebar">섹션 사이드바</option>
            <option value="popup">팝업</option>
          </select>
        </label>

        <label className="md:col-span-2 space-y-1">
          <div className="text-sm text-gray-600">이미지 URL</div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.imageUrl || ""}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">링크 URL</div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.linkUrl || ""}
            onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
            placeholder="https://..."
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">링크 타겟</div>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={(form.linkTarget ?? "_self") as LinkTarget}
            onChange={(e) =>
              setForm((f) => ({ ...f, linkTarget: e.target.value as LinkTarget }))
            }
          >
            <option value="_self">현재창</option>
            <option value="_blank">새창</option>
          </select>
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">상태</div>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={(form.status ?? "draft") as Status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as Status }))
            }
          >
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="scheduled">scheduled</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">우선순위(작을수록 먼저)</div>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.priority ?? 10}
            onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">게시 시작일</div>
          <input
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2"
            value={(form.startAt || "").toString().slice(0, 16)}
            onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">게시 종료일</div>
          <input
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2"
            value={(form.endAt || "").toString().slice(0, 16)}
            onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
          />
        </label>
      </div>

      {form.imageUrl ? (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <Image
            src={form.imageUrl}
            alt="미리보기"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      ) : null}

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
