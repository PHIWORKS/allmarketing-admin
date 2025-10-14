"use client";

import { useState } from "react";

export type CardNewsItem = {
  imageUrl: string;
  title: string;
  subtitle?: string; // 한 줄 설명
  linkUrl?: string;   // 원문/상세 링크 (선택)
};

export default function CardNewsEditor({
  value,
  onChange,
  max = 30,
}: {
  value: CardNewsItem[];
  onChange: (next: CardNewsItem[]) => void;
  max?: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const add = () => {
    if (value.length >= max) return alert(`최대 ${max}장까지 등록할 수 있어요.`);
    const next = [...value, { imageUrl: "", title: "", subtitle: "", linkUrl: "" }];
    onChange(next);
    setSelected(next.length - 1);
  };

  const update = (i: number, patch: Partial<CardNewsItem>) => {
    const next = value.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onChange(next);
  };

  const dup = (i: number) => {
    const next = [...value];
    next.splice(i + 1, 0, { ...value[i] });
    onChange(next);
    setSelected(i + 1);
  };

  const remove = (i: number) => {
    const ok = confirm("해당 카드를 삭제할까요?");
    if (!ok) return;
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
    setSelected(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    onChange(next);
    setSelected(j);
  };

  return (
    <div className="space-y-4">
      {/* 상단 요약/추가 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">총 {value.length}장 등록됨</div>
        <div className="flex gap-2">
          <button type="button" onClick={add} className="px-3 py-1.5 rounded-lg border">
            카드 추가
          </button>
        </div>
      </div>

      {/* 미리보기 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {value.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`rounded-xl border overflow-hidden text-left ${
              selected === i ? "ring-2 ring-emerald-500" : ""
            }`}
            title="클릭해서 편집"
          >
            <div className="aspect-[4/3] bg-gray-100">
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-xs">
                  이미지
                </div>
              )}
            </div>
            <div className="p-2">
              <div className="truncate font-medium">{c.title || "제목"}</div>
              <div className="truncate text-xs text-gray-500">{c.subtitle || "간단 소개"}</div>
            </div>
          </button>
        ))}
        {value.length === 0 && (
          <div className="col-span-full text-sm text-gray-500">
            아직 카드가 없습니다. “카드 추가”를 눌러 등록하세요.
          </div>
        )}
      </div>

      {/* 우측/하단 상세 편집 폼 */}
      {selected !== null && value[selected] && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">선택된 카드 #{selected + 1}</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(selected, -1)} className="px-3 py-1.5 rounded-lg border">
                ▲ 위로
              </button>
              <button type="button" onClick={() => move(selected, +1)} className="px-3 py-1.5 rounded-lg border">
                ▼ 아래
              </button>
              <button type="button" onClick={() => dup(selected)} className="px-3 py-1.5 rounded-lg border">
                복제
              </button>
              <button type="button" onClick={() => remove(selected)} className="px-3 py-1.5 rounded-lg border">
                삭제
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">이미지 URL</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={value[selected].imageUrl}
                onChange={(e) => update(selected, { imageUrl: e.target.value })}
                placeholder="https://.../image.jpg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">링크 URL(선택)</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={value[selected].linkUrl || ""}
                onChange={(e) => update(selected, { linkUrl: e.target.value })}
                placeholder="https://... (카드를 클릭했을 때 이동)"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">제목</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={value[selected].title}
                onChange={(e) => update(selected, { title: e.target.value })}
                placeholder="카드 제목"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">간단 소개</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={value[selected].subtitle || ""}
                onChange={(e) => update(selected, { subtitle: e.target.value })}
                placeholder="한 줄 소개"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
