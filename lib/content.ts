// lib/content.ts

// ----- 섹션 타입 -----
export type Section =
  | "data365"
  | "market"
  | "consumer"
  | "brands"
  | "media"
  | "global"
  | "resource";

// ----- 상태/표시/권한 -----
export type Status = "draft" | "scheduled" | "published" | "archived";
export type DisplayType = "cardNews" | "infographic" | "album" | "video" | "summary";
export type ContentType = "report" | "table" | "graph" | "videoDesc" | "summary";
export type AccessScope = "everyone" | "members" | "paid";
export type UploadCycle = "daily" | "weekly" | "irregular";

// ----- 콘텐츠 엔티티 -----
export interface ContentItem {
  id: string;
  section: Section;
  title: string;
  summary?: string;
  body: string;
  thumbnail?: string;
  categories: string[];          // 섹션별 서브메뉴
  tags: string[];

  displayType: DisplayType;      // 카드/앨범/인포그래픽/영상/요약
  contentType: ContentType;      // report/table/graph/videoDesc/summary
  uploadCycle: UploadCycle;      // daily/weekly/irregular
  accessScope: AccessScope;      // everyone/members/paid

  attachments: {
    name: string;
    url: string;
    kind: "infograph" | "report" | "table" | "graph";
  }[];

  status: Status;
  publishAt?: string | null;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ----- 라벨 -----
export const SECTION_LABEL: Record<Section, string> = {
  data365: "DATA365",
  market: "MARKET",
  consumer: "CONSUMER",
  brands: "BRANDS",
  media: "MEDIA",
  global: "GLOBAL",
  resource: "RESOURCE",
};

// ----- 섹션별 카테고리(서브메뉴) -----
export const CATEGORY_MAP: Record<Section, string[]> = {
  data365: [],
  market: [
    "가전/IT기기",
    "패션/쇼핑",
    "식품",
    "미용·위생",
    "건강관리",
    "금융·부동산",
    "홈테크",
    "모빌리티",
    "유아동·반려",
    "통신·교육·구독",
    "담배·주류",
  ],
  consumer: ["Trends", "Lifestyle", "여행·레저·외식"],
  brands: ["브랜드 리포트"],
  media: ["Print", "방송", "OTT", "라디오", "온라인", "OOH", "TPS"],
  global: ["TGI", "GQV", "Global OTT"],
  resource: ["Syndicate 소개"],
};

// ----- 섹션별 기본값 -----
export const DEFAULTS: Record<Section, Partial<ContentItem>> = {
  data365: { displayType: "cardNews", accessScope: "everyone", uploadCycle: "daily" },
  market: { displayType: "album", accessScope: "members", uploadCycle: "weekly" },
  consumer: { accessScope: "members", uploadCycle: "weekly" },
  brands: { accessScope: "members" },
  media: {},
  global: { accessScope: "everyone" },
  resource: { accessScope: "everyone", uploadCycle: "irregular" },
};
