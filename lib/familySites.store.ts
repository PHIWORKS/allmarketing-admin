export type FamilySite = {
  id: string;
  name: string;      // 표시명
  url: string;       // 이동 URL
  visible: boolean;  // 노출
  order: number;     // 정렬 (작을수록 먼저)
  createdAt: string;
  updatedAt: string;
};

// HMR에서 유지
declare global {
  var __FAMILY_SITES__: FamilySite[] | undefined;
}
const g = globalThis as typeof globalThis;

g.__FAMILY_SITES__ ??= [
  {
    id: "1",
    name: "AllMarketing 메인",
    url: "https://example.com",
    visible: true,
    order: 1,
    createdAt: "2025-10-10T09:00:00",
    updatedAt: "2025-10-10T09:00:00",
  },
  {
    id: "2",
    name: "관련사 블로그",
    url: "https://blog.example.com",
    visible: true,
    order: 2,
    createdAt: "2025-10-10T09:10:00",
    updatedAt: "2025-10-10T09:10:00",
  },
];

export const FAMILY_SITES = g.__FAMILY_SITES__!;

export function listFamilySites() {
  return [...FAMILY_SITES].sort((a, b) => a.order - b.order);
}

export function getFamilySite(id: string) {
  return FAMILY_SITES.find((s) => s.id === id) || null;
}

export function createFamilySite(body: Partial<FamilySite>): FamilySite {
  const now = new Date().toISOString();
  const item: FamilySite = {
    id: String(Date.now()),
    name: body.name ?? "(제목 없음)",
    url: body.url ?? "https://",
    visible: body.visible ?? true,
    order: body.order ?? 99,
    createdAt: now,
    updatedAt: now,
  };
  FAMILY_SITES.push(item);
  return item;
}

export function updateFamilySite(id: string, patch: Partial<FamilySite>) {
  const idx = FAMILY_SITES.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  FAMILY_SITES[idx] = { ...FAMILY_SITES[idx], ...patch, updatedAt: new Date().toISOString() };
  return FAMILY_SITES[idx];
}

export function removeFamilySite(id: string) {
  const idx = FAMILY_SITES.findIndex((s) => s.id === id);
  if (idx < 0) return false;
  FAMILY_SITES.splice(idx, 1);
  return true;
}
