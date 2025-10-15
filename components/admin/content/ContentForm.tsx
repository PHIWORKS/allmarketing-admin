"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_MAP,
  DEFAULTS,
  type Section,
  type ContentItem,
} from "@/lib/content";
import CardNewsEditor, { type CardNewsItem } from "./CardNewsEditor";

/**
 * ContentForm (관리자용 통합본)
 * - 썸네일: 앨범형(이미지 + 제목 + 간단 소개)
 * - DATA365: 카드뉴스(여러 장) 편집기 포함 (cards[])
 * - 세부내용: Report 개요 / Summary / 영상 / 설명 / Infograph (blocks[])
 * - 첨부파일/다운로드: Report/Infograph/Table/Graph (attachments[])
 * - 저장/취소 (발행은 상태를 '발행'으로 바꾼 뒤 저장)
 */

type Blocks =
  | { type: "reportOverview"; title?: string; publisher?: string; date?: string; pages?: string; fileUrl?: string }
  | { type: "summary"; text: string }
  | { type: "video"; url: string; duration?: string }
  | { type: "description"; html: string }
  | { type: "infograph"; imageUrl: string; caption?: string };

type Attachment = { name: string; url: string; kind: "infograph" | "report" | "table" | "graph" };

// 초기 body에서 cards를 복구
function readCardsFromInitialBody(init?: Partial<ContentItem>): CardNewsItem[] {
  try {
    if (init?.body) {
      const parsed = JSON.parse(init.body as string);
      if (Array.isArray(parsed?.cards)) return parsed.cards as CardNewsItem[];
      if (Array.isArray(parsed?.blocks?.cards)) return parsed.blocks.cards as CardNewsItem[];
    }
  } catch {}
  return [];
}

export default function ContentForm({
  section,
  initial,
  onSaved,
}: {
  section: Section;
  initial?: Partial<ContentItem>;
  onSaved?(id: string): void;
}) {
  const router = useRouter();

  // 기본값 + 초기값 병합
  const [form, setForm] = useState<Partial<ContentItem>>({
    ...DEFAULTS[section],
    ...initial,
    section,
    status: initial?.status || "draft",
    displayType: "album", // 앨범형 고정
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof ContentItem>(k: keyof ContentItem, v:  ContentItem[K]) => {
    setDirty(true);
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  // 썸네일/요약
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initial?.thumbnail || "");
  const [summary, setSummary] = useState<string>(initial?.summary || "");

  // DATA365 카드뉴스
  const [cards, setCards] = useState<CardNewsItem[]>(
    section === "data365" ? readCardsFromInitialBody(initial) : []
  );

  // 세부 블록 ON/OFF
  const [useReport, setUseReport] = useState<boolean>(true);
  const [useSummary, setUseSummary] = useState<boolean>(true);
  const [useVideo, setUseVideo] = useState<boolean>(false);
  const [useDesc, setUseDesc] = useState<boolean>(true);
  const [useInfograph, setUseInfograph] = useState<boolean>(false);

  // Report 개요
  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportPublisher, setReportPublisher] = useState<string>("");
  const [reportDate, setReportDate] = useState<string>(""); // YYYY-MM-DD
  const [reportPages, setReportPages] = useState<string>("");
  const [reportFileUrl, setReportFileUrl] = useState<string>("");

  // Summary
  const [summaryText, setSummaryText] = useState<string>("");

  // Video
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<string>(""); // mm:ss

  // Description
  const [descHtml, setDescHtml] = useState<string>("");

  // Infograph
  const [infoImageUrl, setInfoImageUrl] = useState<string>("");
  const [infoCaption, setInfoCaption] = useState<string>("");

  // 첨부파일/다운로드
  const [attachments, setAttachments] = useState<Attachment[]>(
    (initial?.attachments as Attachment[]) || []
  );
  const addAttachment = () => {
    setDirty(true);
    setAttachments((prev) => [...prev, { name: "", url: "", kind: "report" }]);
  };
  const removeAttachment = (i: number) => {
    setDirty(true);
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));
  };
  const setAttachment = (i: number, patch: Partial<Attachment>) => {
    setDirty(true);
    setAttachments((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  // 섹션 프리셋(신규 작성 시에만)
  useEffect(() => {
    if (initial?.id) return;
    if (section === "media") {
      setUseVideo(true);
      setUseReport(false);
      setUseInfograph(false);
    }
    if (section === "global" || section === "resource") {
      setUseReport(true);
    }
  }, [section, initial?.id]);

  // 저장용 블록 JSON
  const blocks = useMemo(() => {
    const out: Blocks[] = [];
    if (useReport)
      out.push({
        type: "reportOverview",
        title: reportTitle,
        publisher: reportPublisher,
        date: reportDate,
        pages: reportPages,
        fileUrl: reportFileUrl,
      });
    if (useSummary) out.push({ type: "summary", text: summaryText });
    if (useVideo) out.push({ type: "video", url: videoUrl, duration: videoDuration });
    if (useDesc) out.push({ type: "description", html: descHtml });
    if (useInfograph) out.push({ type: "infograph", imageUrl: infoImageUrl, caption: infoCaption });
    return out;
  }, [
    useReport,
    reportTitle,
    reportPublisher,
    reportDate,
    reportPages,
    reportFileUrl,
    useSummary,
    summaryText,
    useVideo,
    videoUrl,
    videoDuration,
    useDesc,
    descHtml,
    useInfograph,
    infoImageUrl,
    infoCaption,
  ]);

  const submit = async () => {
    setSaving(true);

    const payload: Partial<ContentItem> = {
      ...form,
      title: form.title || "",
      summary,
      thumbnail: thumbnailUrl,
      displayType: "album",
      contentType: "summary",         // body는 구조화(JSON)
      body: JSON.stringify({ cards, blocks }), // ✅ DATA365 카드뉴스 + 세부 블록 동시 저장
      status: form.status,
      categories: form.categories || [],
      tags: form.tags || [],
      attachments,                    // 다운로드/첨부
    };

    const url = initial?.id
      ? `/api/admin/content/${section}/${initial.id}`
      : `/api/admin/content/${section}`;
    const method = initial?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const j = await res.json();
    setSaving(false);
    setDirty(false);
    onSaved?.(j.id);
  };

  const onCancel = () => {
    if (dirty) {
      const ok = confirm("변경사항이 저장되지 않았습니다. 취소하시겠습니까?");
      if (!ok) return;
    }
    router.back(); // 또는 router.replace(`/admin/content/${section}`)
  };

  return (
    <div className="space-y-5">
      {/* 기본 정보 */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">제목</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="콘텐츠 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">카테고리</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.categories?.[0] || ""}
              onChange={(e) => set("categories", e.target.value ? [e.target.value] : [])}
            >
              <option value="">선택</option>
              {CATEGORY_MAP[section].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">공개 범위</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.accessScope || ""}
              onChange={(e) => set("accessScope", e.target.value)}
            >
              <option value="everyone">전체 공개</option>
              <option value="members">멤버 공개</option>
              <option value="paid">유료 공개</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">업로드 주기</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.uploadCycle || "weekly"}
              onChange={(e) => set("uploadCycle", e.target.value)}
            >
              <option value="daily">일간</option>
              <option value="weekly">주간</option>
              <option value="irregular">비정기</option>
            </select>
          </div>
        </div>
      </div>

      {/* 앨범형 썸네일 */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">썸네일 (앨범형 카드)</h3>
          <span className="text-xs text-gray-500">이미지 + 제목 + 간단 소개</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">간단 소개(카드에 노출)</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setDirty(true);
              }}
              placeholder="카드에 보여줄 한 줄 소개를 입력하세요"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">썸네일 이미지 URL</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={thumbnailUrl}
              onChange={(e) => {
                setThumbnailUrl(e.target.value);
                setDirty(true);
              }}
              placeholder="https://... (S3/스토리지 URL)"
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          * 실제 이미지 업로드는 추후 스토리지 연동(S3 등)으로 대체 가능
        </div>
      </div>

      {/* DATA365: 카드뉴스 편집 */}
      {section === "data365" && (
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">카드뉴스 편집 (DATA365)</h3>
            <span className="text-xs text-gray-500">이미지 + 제목 + 한 줄 소개 + 링크</span>
          </div>
          <CardNewsEditor
            value={cards}
            onChange={(next) => {
              setCards(next);
              setDirty(true);
            }}
          />
          <p className="text-xs text-gray-500">* 카드 순서는 위/아래 버튼으로 변경할 수 있어요. (최대 30장)</p>
        </div>
      )}

      {/* 세부내용 블록 */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold">세부내용 블록</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={useReport}
              onChange={(e) => {
                setUseReport(e.target.checked);
                setDirty(true);
              }}
            />
            Report 개요
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={useSummary}
              onChange={(e) => {
                setUseSummary(e.target.checked);
                setDirty(true);
              }}
            />
            Summary
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={useVideo}
              onChange={(e) => {
                setUseVideo(e.target.checked);
                setDirty(true);
              }}
            />
            영상
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={useDesc}
              onChange={(e) => {
                setUseDesc(e.target.checked);
                setDirty(true);
              }}
            />
            설명
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={useInfograph}
              onChange={(e) => {
                setUseInfograph(e.target.checked);
                setDirty(true);
              }}
            />
            Infograph
          </label>
        </div>

        {/* Report 개요 */}
        {useReport && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">보고서명</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reportTitle}
                onChange={(e) => {
                  setReportTitle(e.target.value);
                  setDirty(true);
                }}
                placeholder="예: 2025 소비자 트렌드 리포트"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">발행처</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reportPublisher}
                onChange={(e) => {
                  setReportPublisher(e.target.value);
                  setDirty(true);
                }}
                placeholder="예: 올마케팅 인사이트"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">발행일</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={reportDate}
                onChange={(e) => {
                  setReportDate(e.target.value);
                  setDirty(true);
                }}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">페이지수</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reportPages}
                onChange={(e) => {
                  setReportPages(e.target.value);
                  setDirty(true);
                }}
                placeholder="예: 42"
              />
            </div>
            <div className="md:col-span-5">
              <label className="text-sm text-gray-600">보고서 파일 URL (PDF 등)</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reportFileUrl}
                onChange={(e) => {
                  setReportFileUrl(e.target.value);
                  setDirty(true);
                }}
                placeholder="https://.../report.pdf"
              />
            </div>
          </div>
        )}

        {/* Summary */}
        {useSummary && (
          <div className="mt-3">
            <label className="text-sm text-gray-600">Summary (요약문)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
              value={summaryText}
              onChange={(e) => {
                setSummaryText(e.target.value);
                setDirty(true);
              }}
              placeholder="핵심 요약을 입력하세요"
            />
          </div>
        )}

        {/* 영상 */}
        {useVideo && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">영상 URL (YouTube/MP4)</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setDirty(true);
                }}
                placeholder="https://youtu.be/..., https://.../video.mp4"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">재생시간</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={videoDuration}
                onChange={(e) => {
                  setVideoDuration(e.target.value);
                  setDirty(true);
                }}
                placeholder="예: 03:20"
              />
            </div>
          </div>
        )}

        {/* 설명 */}
        {useDesc && (
          <div className="mt-3">
            <label className="text-sm text-gray-600">설명 (HTML/마크다운)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 min-h-[160px]"
              value={descHtml}
              onChange={(e) => {
                setDescHtml(e.target.value);
                setDirty(true);
              }}
              placeholder="상세 설명을 입력하세요 (간단한 HTML/마크다운 허용)"
            />
          </div>
        )}

        {/* Infograph */}
        {useInfograph && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Infograph 이미지 URL</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={infoImageUrl}
                onChange={(e) => {
                  setInfoImageUrl(e.target.value);
                  setDirty(true);
                }}
                placeholder="https://.../infograph.png"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">캡션(선택)</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={infoCaption}
                onChange={(e) => {
                  setInfoCaption(e.target.value);
                  setDirty(true);
                }}
                placeholder="이미지 설명/출처 등"
              />
            </div>
          </div>
        )}
      </div>

      {/* 첨부파일 / 다운로드 */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">첨부파일 / 다운로드</h3>
          <button
            type="button"
            onClick={addAttachment}
            className="px-3 py-1.5 rounded-lg border"
          >
            파일 추가
          </button>
        </div>

        {attachments.length === 0 && (
          <div className="text-sm text-gray-500">첨부파일이 없습니다. ‘파일 추가’를 눌러 등록하세요.</div>
        )}

        <div className="space-y-3">
          {attachments.map((a, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3">
                <label className="text-sm text-gray-600">유형</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={a.kind}
                  onChange={(e) =>
                    setAttachment(i, { kind: e.target.value as Attachment["kind"] })
                  }
                >
                  <option value="report">Report</option>
                  <option value="infograph">Infograph</option>
                  <option value="table">Table</option>
                  <option value="graph">Graph</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="text-sm text-gray-600">파일명</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={a.name}
                  onChange={(e) => setAttachment(i, { name: e.target.value })}
                  placeholder="예: 2025 소비자 트렌드.pdf"
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-sm text-gray-600">URL</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={a.url}
                  onChange={(e) => setAttachment(i, { url: e.target.value })}
                  placeholder="https://.../file.pdf"
                />
              </div>
              <div className="md:col-span-1 pt-6">
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          * Global/Resource는 첨부 위주, Market/Brands/Media는 Report/Infograph 파일 첨부를 권장합니다.
        </p>
      </div>

      {/* 상태/예약/태그 */}
      <div className="rounded-xl border bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">상태</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.status || "draft"}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">임시저장</option>
            <option value="scheduled">예약</option>
            <option value="published">발행</option>
            <option value="archived">보관</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">예약 발행일</label>
          <input
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2"
            value={(form.publishAt || "").slice(0, 16)}
            onChange={(e) =>
              set("publishAt", e.target.value ? new Date(e.target.value).toISOString() : null)
            }
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">태그(쉼표 구분)</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={(form.tags || []).join(", ")}
            onChange={(e) =>
              set(
                "tags",
                e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
              )
            }
            placeholder="예: 트렌드, 소비자, 리포트"
          />
        </div>
      </div>

      {/* 저장/취소 */}
      <div className="flex gap-2">
        <button
          disabled={saving}
          className="px-4 py-2 rounded-xl border bg-white"
          onClick={submit}
        >
          저장
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-xl border bg-white"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
}
