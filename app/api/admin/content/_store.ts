// app/api/admin/content/_store.ts
import type {
  ContentItem, Section, Status, DisplayType, ContentType, AccessScope, UploadCycle,
} from "@/lib/content";
import { DEFAULTS } from "@/lib/content";

type DB = {
  seq: number;
  rows: Record<Section, ContentItem[]>;
};

const SECTIONS: Section[] = [
  "data365", "market", "consumer", "brands", "media", "global", "resource",
];

// ---------- ✅ 타입-안전한 rows 초기화 ----------
const EMPTY_ROWS: Record<Section, ContentItem[]> = SECTIONS
  .reduce((acc, s) => {
    acc[s] = [];
    return acc;
  }, {} as Record<Section, ContentItem[]>);

// HMR에서도 유지
declare global {
  // 전역에 타입 부여
  // (Next.js HMR 시 재평가돼도 충돌 없이 유지)
  var __CONTENT_STORE__:
    | { seq: number; rows: Record<Section, ContentItem[]> }
    | undefined;
}
const g = globalThis as typeof globalThis;

if (!g.__CONTENT_STORE__) {
  g.__CONTENT_STORE__ = {
    seq: 1,
    rows: EMPTY_ROWS,
  };
}
export const db: DB = g.__CONTENT_STORE__ as DB;

// ---------- Utils ----------
function pickOr<T>(v: T | undefined, d: T): T { return v === undefined ? d : v; }

/** lib/content.ts의 스펙을 만족하도록 빠진 필드 기본값 채우기 */
function hydrate(section: Section, payload: Partial<ContentItem>): ContentItem {
  const now = new Date().toISOString();
  const base = { ...(DEFAULTS as Record<Section, Partial<ContentItem>>)[section] };

  const displayType  = (payload.displayType ?? base.displayType ?? "album") as DisplayType;
  const contentType  = (payload.contentType ?? base.contentType ?? "summary") as ContentType;
  const uploadCycle  = (payload.uploadCycle ?? base.uploadCycle ?? "weekly") as UploadCycle;
  const accessScope  = (payload.accessScope ?? base.accessScope ?? "members") as AccessScope;
  const status = (payload.status ?? "draft") as Status;

  const item: ContentItem = {
    id: String(db.seq++),
    section,
    title: payload.title ?? "(제목 없음)",
    summary: payload.summary ?? "",
    body: typeof payload.body === "string" ? payload.body : (payload.body ? JSON.stringify(payload.body) : ""),
    thumbnail: payload.thumbnail ?? "",
    categories: pickOr(payload.categories, []),
    tags: pickOr(payload.tags, []),
    displayType,
    contentType,
    uploadCycle,
    accessScope,
    attachments: pickOr(payload.attachments, []),
    status,
    publishAt: payload.publishAt ?? null,
    createdBy: payload.createdBy ?? "운영자A",
    createdAt: now,
    updatedAt: now,
  };

  return item;
}

// ---------- CRUD ----------
export function create(section: Section, payload: Partial<ContentItem>) {
  const item = hydrate(section, payload);
  db.rows[section].unshift(item);
  return item;
}

export function list(section: Section, params: URLSearchParams) {
  const q = (params.get("q") || "").toLowerCase();
  const status = params.get("status") || "";
  const access = params.get("access") || "";
  const page = Number(params.get("page") || "1");
  const size = Number(params.get("size") || "10");

  let arr = db.rows[section];

  if (q) arr = arr.filter(r => (r.title + r.summary + r.body).toLowerCase().includes(q));
  if (status) arr = arr.filter(r => r.status === status);
  if (access) arr = arr.filter(r => r.accessScope === access);

  const total = arr.length;
  const start = (page - 1) * size;
  const rows = arr.slice(start, start + size);

  return { total, rows };
}

export function get(section: Section, id: string) {
  return db.rows[section].find(r => r.id === id) || null;
}

export function patch(section: Section, id: string, payload: Partial<ContentItem>) {
  const t = get(section, id);
  if (!t) return null;
  Object.assign(t, payload, { updatedAt: new Date().toISOString() });
  return t;
}

export function remove(section: Section, id: string) {
  const i = db.rows[section].findIndex(r => r.id === id);
  if (i >= 0) db.rows[section].splice(i, 1);
  return i >= 0;
}
