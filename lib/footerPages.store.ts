// lib/footerPages.store.ts
export type FooterPage = {
  id: string;
  slug: string;          // URL path (예: /privacy, /terms)
  title: string;
  visible: boolean;      // 노출 여부
  order: number;         // 정렬 우선순위(작을수록 상단)
  contentHtml: string;   // HTML 본문
  createdAt: string;
  updatedAt: string;
};

// HMR에서도 유지
declare global {
  var __FOOTER_PAGES__: FooterPage[] | undefined;
}
const g = globalThis as typeof globalThis;

if (!g.__FOOTER_PAGES__) {
  g.__FOOTER_PAGES__ = [
    {
      id: "1",
      slug: "/privacy",
      title: "개인정보처리방침",
      visible: true,
      order: 1,
      contentHtml: "<h1>개인정보처리방침</h1><p>내용</p>",
      createdAt: "2025-10-10T09:00:00",
      updatedAt: "2025-10-10T09:00:00",
    },
    {
      id: "2",
      slug: "/terms",
      title: "이용약관",
      visible: true,
      order: 2,
      contentHtml: "<h1>이용약관</h1><p>내용</p>",
      createdAt: "2025-10-10T09:10:00",
      updatedAt: "2025-10-10T09:10:00",
    },
    {
      id: "3",
      slug: "/about",
      title: "회사소개",
      visible: false,
      order: 3,
      contentHtml: "<h1>회사소개</h1><p>내용</p>",
      createdAt: "2025-10-11T08:00:00",
      updatedAt: "2025-10-11T08:00:00",
    },
  ] as FooterPage[];
}
export const FOOTER_PAGES = g.__FOOTER_PAGES__!;

export function listFooterPages() {
  // order 오름차순
  return [...FOOTER_PAGES].sort((a, b) => a.order - b.order);
}

export function getFooterPage(id: string) {
  return FOOTER_PAGES.find((p) => p.id === id) || null;
}

export function createFooterPage(body: Partial<FooterPage>): FooterPage {
  const now = new Date().toISOString();
  const item: FooterPage = {
    id: String(Date.now()),
    slug: body.slug ?? "/new-page",
    title: body.title ?? "(제목 없음)",
    visible: body.visible ?? true,
    order: body.order ?? 99,
    contentHtml: body.contentHtml ?? "",
    createdAt: now,
    updatedAt: now,
  };
  FOOTER_PAGES.push(item);
  return item;
}

export function updateFooterPage(
  id: string,
  patch: Partial<FooterPage>
): FooterPage | null {
  const idx = FOOTER_PAGES.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  FOOTER_PAGES[idx] = {
    ...FOOTER_PAGES[idx],
    ...patch,
    updatedAt: now,
  };
  return FOOTER_PAGES[idx];
}

export function removeFooterPage(id: string): boolean {
  const idx = FOOTER_PAGES.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  FOOTER_PAGES.splice(idx, 1);
  return true;
}
