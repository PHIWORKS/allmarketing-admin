// app/api/admin/content/_store.ts
import type {
  ContentItem,
  Section,
  Status,
  DisplayType,
  ContentType,
  AccessScope,
  UploadCycle,
} from "@/lib/content";
import { DEFAULTS } from "@/lib/content";

type DB = {
  seq: number;
  rows: Record<Section, ContentItem[]>;
};

const SECTIONS: Section[] = [
  "data365", "market", "consumer", "brands", "media", "global", "resource",
];

// HMR에서도 유지
const g = globalThis as any;
if (!g.__CONTENT_STORE__) {
  g.__CONTENT_STORE__ = {
    seq: 1,
    rows: Object.fromEntries(SECTIONS.map(s => [s, []])),
  } as DB;
}
export const db: DB = g.__CONTENT_STORE__;

// ---------- Utils ----------
function pickOr<T>(v: T | undefined, d: T): T { return v === undefined ? d : v; }

/** lib/content.ts의 스펙을 만족하도록 빠진 필드 기본값 채우기 */
function hydrate(section: Section, payload: Partial<ContentItem>): ContentItem {
  const now = new Date().toISOString();

  // DEFAULTS 병합
  const base = { ...DEFAULTS[section] };

  const displayType = (payload.displayType ?? (base as any).displayType ?? "album") as DisplayType;
  const contentType = (payload.contentType ?? (base as any).contentType ?? "summary") as ContentType;
  const uploadCycle = (payload.uploadCycle ?? (base as any).uploadCycle ?? "weekly") as UploadCycle;
  const accessScope = (payload.accessScope ?? (base as any).accessScope ?? "members") as AccessScope;
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

  // 업데이트 시에도 타입 안전하게 기본값 유지
  Object.assign(t, payload, {
    updatedAt: new Date().toISOString(),
  });
  return t;
}

export function remove(section: Section, id: string) {
  const i = db.rows[section].findIndex(r => r.id === id);
  if (i >= 0) db.rows[section].splice(i, 1);
  return i >= 0;
}
