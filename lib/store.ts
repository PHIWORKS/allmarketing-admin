// lib/store.ts
import { MOCK_CONTENT } from "@/lib/mockContent";
import type { ContentItem, Section, Status } from "@/lib/content";

/** 전역 메모리 DB 타입 */
type DB = Record<Section, ContentItem[]>;

/** 섹션 상수 (가드에서 사용) */
const SECTIONS: ReadonlyArray<Section> = [
  "data365",
  "market",
  "consumer",
  "brands",
  "media",
  "global",
  "resource",
] as const;

/** 섹션 문자열이 유효한지 체크 (런타임 가드) */
function assertSection(s: string): asserts s is Section {
  if (!(SECTIONS as readonly string[]).includes(s)) {
    throw new Error(`Invalid section: ${s}`);
  }
}

/** HMR에서도 유지될 전역 변수 타입 선언 */
declare global {
  var __MEM_DB__: DB | undefined;
}

/** 타입 안전한 globalThis 참조 */
const g = globalThis as typeof globalThis;

/** 초기 DB 준비 (structuredClone 미지원 환경 대비) */
const initialDb: DB =
  typeof structuredClone === "function"
    ? (structuredClone(MOCK_CONTENT) as DB)
    : (JSON.parse(JSON.stringify(MOCK_CONTENT)) as DB);

/** 전역 DB 인스턴스 (없으면 초기화) */
export const db: DB = g.__MEM_DB__ ?? (g.__MEM_DB__ = initialDb);

/** 유틸 */
const now = () => new Date().toISOString();

/** 목록 조회 */
export function list(
  section: string,
  qs: URLSearchParams
): { total: number; rows: ContentItem[] } {
  assertSection(section);
  const sec = section; // 이제 Section으로 좁혀짐

  const q = (qs.get("q") || "").toLowerCase();
  const status = (qs.get("status") as Status | "") || "";
  const access = qs.get("access") || "";
  const page = Number(qs.get("page") || "1");
  const size = Number(qs.get("size") || "10");

  let rows = db[sec];

  if (q) rows = rows.filter((r) => (r.title + r.summary + r.body).toLowerCase().includes(q));
  if (status) rows = rows.filter((r) => r.status === status);
  if (access) rows = rows.filter((r) => r.accessScope === access);

  const total = rows.length;
  const sliced = rows.slice((page - 1) * size, page * size);

  return { total, rows: sliced };
}

/** 단건 조회 */
export function getOne(section: string, id: string): ContentItem | null {
  assertSection(section);
  const sec = section;
  return db[sec].find((r) => r.id === id) || null;
}

/** 신규 생성 */
let seq = 1000;
export function create(section: string, data: Partial<ContentItem>): ContentItem {
  assertSection(section);
  const sec = section;
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
    status: data.status || "draft",
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

/** 업데이트 */
export function update(
  section: string,
  id: string,
  patch: Partial<ContentItem>
): ContentItem {
  assertSection(section);
  const sec = section;

  const idx = db[sec].findIndex((r) => r.id === id);
  if (idx < 0) {
    throw new Error("not found");
  }

  db[sec][idx] = { ...db[sec][idx], ...patch, updatedAt: now() };
  return db[sec][idx];
}
