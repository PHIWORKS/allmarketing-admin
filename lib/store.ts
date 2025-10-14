// lib/store.ts
import { MOCK_CONTENT } from "@/lib/mockContent";
import type { ContentItem, Section, Status } from "@/lib/content";

// 전역 메모리 DB (개발용)
type DB = Record<Section, ContentItem[]>;
const g = globalThis as any;
export const db: DB = g.__MEM_DB__ || (g.__MEM_DB__ = structuredClone(MOCK_CONTENT));

// 유틸
const now = () => new Date().toISOString();
const toSection = (s: string) => s as Section;

export function list(section: string, qs: URLSearchParams) {
  const sec = toSection(section);
  const q = (qs.get("q") || "").toLowerCase();
  const status = qs.get("status") as Status | "" ;
  const access = qs.get("access") || "";
  const page = Number(qs.get("page") || "1");
  const size = Number(qs.get("size") || "10");

  let rows = db[sec];
  if (q) rows = rows.filter(r => (r.title + r.summary + r.body).toLowerCase().includes(q));
  if (status) rows = rows.filter(r => r.status === status);
  if (access) rows = rows.filter(r => r.accessScope === access);

  const total = rows.length;
  const slice = rows.slice((page-1)*size, page*size);
  return { total, rows: slice };
}

export function getOne(section: string, id: string) {
  const sec = toSection(section);
  return db[sec].find(r => r.id === id) || null;
}

let seq = 1000;
export function create(section: string, data: Partial<ContentItem>) {
  const sec = toSection(section);
  const id = String(++seq);
  const item: ContentItem = {
    id,
    section: sec,
    title: data.title || "(제목 없음)",
    body: data.body || "",
    categories: data.categories || [],
    tags: data.tags || [],
    displayType: data.displayType || "cardNews",
    contentType: data.contentType || "summary",
    uploadCycle: data.uploadCycle || "weekly",
    accessScope: data.accessScope || "everyone",
    attachments: data.attachments || [],
    status: (data.status || "draft"),
    publishAt: data.publishAt ?? null,
    thumbnail: data.thumbnail,
    summary: data.summary,
    createdBy: "운영자A",
    createdAt: now(),
    updatedAt: now(),
  };
  db[sec].unshift(item);
  return item;
}

export function update(section: string, id: string, patch: Partial<ContentItem>) {
  const sec = toSection(section);
  const idx = db[sec].findIndex(r => r.id === id);
  if (idx < 0) throw new Error("not found");
  db[sec][idx] = { ...db[sec][idx], ...patch, updatedAt: now() };
  return db[sec][idx];
}
