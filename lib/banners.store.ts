export type BannerStatus = "draft" | "active" | "scheduled" | "archived";
export type BannerPlace =
  | "home_top"
  | "home_middle"
  | "home_bottom"
  | "section_sidebar"
  | "popup";

export type Banner = {
  id: string;
  title: string;
  place: BannerPlace;
  imageUrl: string;
  linkUrl?: string;
  linkTarget?: "_self" | "_blank";
  status: BannerStatus;
  priority: number;       // 숫자 낮을수록 먼저 노출
  startAt?: string | null;
  endAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

let BANNERS: Banner[] = [
  {
    id: "b1",
    title: "홈 상단 프로모션",
    place: "home_top",
    imageUrl: "https://picsum.photos/1200/300?1",
    linkUrl: "https://example.com",
    linkTarget: "_blank",
    status: "active",
    priority: 1,
    startAt: "2025-10-01T00:00:00Z",
    endAt: null,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-10T00:00:00Z",
  },
  {
    id: "b2",
    title: "섹션 사이드바 배너",
    place: "section_sidebar",
    imageUrl: "https://picsum.photos/360/600?2",
    status: "scheduled",
    priority: 10,
    startAt: "2025-10-20T00:00:00Z",
    endAt: null,
    createdAt: "2025-10-12T08:00:00Z",
    updatedAt: "2025-10-12T08:00:00Z",
  },
];

export function listBanners(params: {
  q?: string;
  status?: BannerStatus | "";
  place?: BannerPlace | "";
  page?: number;
  size?: number;
}) {
  const { q = "", status = "", place = "", page = 1, size = 10 } = params;
  let rows = BANNERS.filter((b) =>
    (!q || b.title.toLowerCase().includes(q.toLowerCase())) &&
    (!status || b.status === status) &&
    (!place || b.place === place)
  ).sort((a, b) => a.priority - b.priority || (b.createdAt > a.createdAt ? 1 : -1));
  const total = rows.length;
  rows = rows.slice((page - 1) * size, page * size);
  return { total, rows };
}

export function createBanner(input: Partial<Banner>): Banner {
  const now = new Date().toISOString();
  const b: Banner = {
    id: String(Date.now()),
    title: input.title ?? "",
    place: (input.place as BannerPlace) ?? "home_top",
    imageUrl: input.imageUrl ?? "",
    linkUrl: input.linkUrl || "",
    linkTarget: (input.linkTarget as "_self" | "_blank") ?? "_self",
    status: (input.status as BannerStatus) ?? "draft",
    priority: typeof input.priority === "number" ? input.priority : 10,
    startAt: input.startAt || null,
    endAt: input.endAt || null,
    createdAt: now,
    updatedAt: now,
  };
  BANNERS.unshift(b);
  return b;
}

export function getBanner(id: string) {
  return BANNERS.find((b) => b.id === id) || null;
}

export function updateBanner(id: string, patch: Partial<Banner>) {
  const idx = BANNERS.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  BANNERS[idx] = {
    ...BANNERS[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return BANNERS[idx];
}

export function removeBanner(id: string) {
  const before = BANNERS.length;
  BANNERS = BANNERS.filter((b) => b.id !== id);
  return before !== BANNERS.length;
}
