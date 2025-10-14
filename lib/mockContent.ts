// lib/mockContent.ts
import type { ContentItem, Section } from "@/lib/content";

// 간단한 유틸
const now = () => new Date().toISOString();
const d = (s: Section) => s.toUpperCase();

// 섹션별 예시 데이터 (각 1~2개)
export const MOCK_CONTENT: Record<Section, ContentItem[]> = {
  data365: [
    {
      id: "1",
      section: "data365",
      title: "데일리 인포그래픽: 가전 소비 현황",
      summary: "전일 기준 카테고리별 판매 추이 요약",
      body: "<p>핵심 수치와 간단한 코멘트…</p>",
      thumbnail: "/images/sample/data365-01.jpg",
      categories: ["Infographic"], // 자유 입력 영역 (DATA365는 카테고리 비워도 됨)
      tags: ["daily", "infographic"],
      displayType: "cardNews",
      contentType: "summary",
      uploadCycle: "daily",
      accessScope: "everyone",
      attachments: [
        { name: "인포그래픽 이미지", url: "/files/data365-01.png", kind: "infograph" },
      ],
      status: "published",
      publishAt: now(),
      createdBy: "운영자A",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  market: [
    {
      id: "1",
      section: "market",
      title: "가전/IT기기 3분기 시장 스냅샷",
      summary: "주요 브랜드 점유율과 채널 트렌드",
      body: "<h2>요약</h2><p>점유율/채널/가격대 분석…</p>",
      thumbnail: "/images/sample/market-01.jpg",
      categories: ["가전/IT기기"],
      tags: ["점유율", "채널"],
      displayType: "album",
      contentType: "report",
      uploadCycle: "weekly",
      accessScope: "members",
      attachments: [
        { name: "요약 리포트(PDF)", url: "/files/market-q3-summary.pdf", kind: "report" },
        { name: "테이블 CSV", url: "/files/market-q3-table.csv", kind: "table" },
      ],
      status: "published",
      publishAt: now(),
      createdBy: "애널리스트B",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  consumer: [
    {
      id: "1",
      section: "consumer",
      title: "Lifestyle: 홈카페 지출 증가",
      summary: "밀레니얼/GenZ 중심의 소비 패턴",
      body: "소비자 조사 결과 요약…",
      thumbnail: "/images/sample/consumer-01.jpg",
      categories: ["Lifestyle"],
      tags: ["GenZ", "홈카페"],
      displayType: "cardNews",
      contentType: "summary",
      uploadCycle: "weekly",
      accessScope: "members",
      attachments: [],
      status: "published",
      publishAt: now(),
      createdBy: "리서처C",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  brands: [
    {
      id: "1",
      section: "brands",
      title: "브랜드 리포트: ACME 2025",
      summary: "브랜드 인지도/선호도/구매전환",
      body: "<p>브랜드 KPI와 캠페인 성과…</p>",
      thumbnail: "/images/sample/brands-01.jpg",
      categories: ["브랜드 리포트"],
      tags: ["KPI", "캠페인"],
      displayType: "album",
      contentType: "report",
      uploadCycle: "weekly",
      accessScope: "members",
      attachments: [{ name: "요약 리포트", url: "/files/brand-acme.pdf", kind: "report" }],
      status: "published",
      publishAt: now(),
      createdBy: "PMD",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  media: [
    {
      id: "1",
      section: "media",
      title: "OTT 광고 시청 완주율 벤치마크",
      summary: "포맷별 평균 완주율과 편차",
      body: "30s, 15s, 스킵가능 광고 비교…",
      thumbnail: "/images/sample/media-ott.jpg",
      categories: ["OTT"],
      tags: ["벤치마크", "완주율"],
      displayType: "cardNews",
      contentType: "graph",
      uploadCycle: "weekly",
      accessScope: "members",
      attachments: [{ name: "그래프 PNG", url: "/files/ott-retention.png", kind: "graph" }],
      status: "published",
      publishAt: now(),
      createdBy: "미디어팀",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  global: [
    {
      id: "1",
      section: "global",
      title: "TGI: 카테고리별 관심도 Top5",
      summary: "글로벌 12개국 비교",
      body: "국가/카테고리 매트릭스…",
      thumbnail: "/images/sample/global-01.jpg",
      categories: ["TGI"],
      tags: ["Global", "Index"],
      displayType: "cardNews",
      contentType: "table",
      uploadCycle: "weekly",
      accessScope: "everyone",
      attachments: [{ name: "TGI 테이블", url: "/files/tgi-table.csv", kind: "table" }],
      status: "published",
      publishAt: now(),
      createdBy: "Global팀",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  resource: [
    {
      id: "1",
      section: "resource",
      title: "Syndicate 서비스 소개",
      summary: "데이터 소스/프로세스/출력물 안내",
      body: "온보딩 가이드/FAQ/샘플…",
      thumbnail: "/images/sample/resource-01.jpg",
      categories: ["Syndicate 소개"],
      tags: ["가이드", "FAQ"],
      displayType: "summary",
      contentType: "summary",
      uploadCycle: "irregular",
      accessScope: "everyone",
      attachments: [],
      status: "published",
      publishAt: now(),
      createdBy: "운영자A",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
};

// 편의 함수들 (원하면 API/스토어에서 그대로 사용)
export function getBySection(section: Section) {
  return MOCK_CONTENT[section];
}
export function getOne(section: Section, id: string) {
  return MOCK_CONTENT[section].find((x) => x.id === id) || null;
}
export function upsert(item: ContentItem) {
  const arr = MOCK_CONTENT[item.section];
  const idx = arr.findIndex((x) => x.id === item.id);
  if (idx === -1) arr.push(item);
  else arr[idx] = { ...arr[idx], ...item, updatedAt: now() };
  return item;
}
