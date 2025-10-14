// scripts/seedExamples.mjs
// Node 18+ (native fetch) 필요
// BASE_URL, AUTH_COOKIE(선택) 환경변수 지원

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const AUTH_COOKIE = process.env.AUTH_COOKIE || ""; // 예: "next-auth.session-token=xxx"

async function post(section, payload) {
  const url = `${BASE_URL}/api/admin/content/${section}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(AUTH_COOKIE ? { Cookie: AUTH_COOKIE } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${url} -> ${res.status} ${res.statusText}\n${text}`);
  }
  return res.json();
}

function bodyJson(obj) {
  // 안전하게 이스케이프된 JSON 문자열로 저장 (백엔드에서 JSON.parse(item.body))
  return JSON.stringify(obj).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function seed() {
  const jobs = [
    // 1) DATA365 — 카드뉴스 2장 + Summary
    {
      section: "data365",
      payload: {
        title: "데일리 인포그래픽: 가전 소비 현황",
        summary: "이번 주 가전 카테고리 요약",
        thumbnail: "https://picsum.photos/id/1024/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["Infographic"],
        tags: ["예시","data365"],
        attachments: [],
        body: bodyJson({
          cards: [
            {
              imageUrl: "https://picsum.photos/id/1050/800/600",
              title: "TV 교체 수요",
              subtitle: "상반기 급증",
              linkUrl: "https://example.com/tv"
            },
            {
              imageUrl: "https://picsum.photos/id/1040/800/600",
              title: "소형가전 판매",
              subtitle: "온라인 중심",
              linkUrl: "https://example.com/small-appliance"
            }
          ],
          blocks: [{ type: "summary", text: "카드 2장으로 이번 주 핵심을 요약합니다." }]
        })
      }
    },

    // 2) MARKET — Report 개요 + Summary + 설명 + 첨부(Report)
    {
      section: "market",
      payload: {
        title: "가전시장 동향 10월 3주",
        summary: "주요 브랜드 점유율과 교체 수요 중심",
        thumbnail: "https://picsum.photos/id/1011/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["가전/IT기기"],
        tags: ["예시","market"],
        attachments: [
          { name: "가전시장_요약보고서.pdf", url: "https://example.com/report.pdf", kind: "report" }
        ],
        body: bodyJson({
          cards: [],
          blocks: [
            {
              type: "reportOverview",
              title: "가전시장 리포트",
              publisher: "AllMarketing Insight",
              date: "2025-10-10",
              pages: "42",
              fileUrl: "https://example.com/report.pdf"
            },
            {
              type: "summary",
              text: "교체 수요와 프로모션 영향으로 TV/청소기 판매가 반등했습니다."
            },
            {
              type: "description",
              html: "<p>유통 채널별 판매 추이는 오프라인보다 온라인이 강세입니다.</p>"
            }
          ]
        })
      }
    },

    // 3) CONSUMER — Summary + 설명
    {
      section: "consumer",
      payload: {
        title: "소비자 트렌드: 가치소비 확대",
        summary: "합리적 소비/친환경 선호 증가",
        thumbnail: "https://picsum.photos/id/1037/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["Trends"],
        tags: ["예시","consumer"],
        attachments: [],
        body: bodyJson({
          cards: [],
          blocks: [
            { type: "summary", text: "가격 대비 가치에 민감하고, 친환경 옵션을 선호합니다." },
            { type: "description", html: "<ul><li>구독형 서비스 충성도 상승</li><li>리뷰/커뮤니티 영향력 확대</li></ul>" }
          ]
        })
      }
    },

    // 4) BRANDS — Report 개요 + Infograph + 첨부(Infograph)
    {
      section: "brands",
      payload: {
        title: "브랜드 인지도: 상위 5개사",
        summary: "상반기 캠페인 효과 분석",
        thumbnail: "https://picsum.photos/id/1027/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["브랜드 분석"],
        tags: ["예시","brands"],
        attachments: [
          { name: "브랜드_이미지.png", url: "https://picsum.photos/id/1025/1200/800", kind: "infograph" }
        ],
        body: bodyJson({
          cards: [],
          blocks: [
            {
              type: "reportOverview",
              title: "브랜드 인지도 분석",
              publisher: "AllMarketing",
              date: "2025-10-12",
              pages: "18",
              fileUrl: "https://example.com/brands.pdf"
            },
            { type: "infograph", imageUrl: "https://picsum.photos/id/1025/1200/800", caption: "상위 5개 브랜드 인지도" }
          ]
        })
      }
    },

    // 5) MEDIA — 영상(유튜브) + Summary
    {
      section: "media",
      payload: {
        title: "주간 미디어 리포트: OTT 광고지표",
        summary: "완주율/CPM/빈도 분석",
        thumbnail: "https://picsum.photos/id/1005/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["온라인"],
        tags: ["예시","media","ott"],
        attachments: [],
        body: bodyJson({
          cards: [],
          blocks: [
            { type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "03:20" },
            { type: "summary", text: "OTT 완주율은 장르/회차에 따라 편차가 큽니다." }
          ]
        })
      }
    },

    // 6) GLOBAL — Report 개요 + 첨부(Table/Graph)
    {
      section: "global",
      payload: {
        title: "Global TGI: 음료 카테고리",
        summary: "연령대별 선호/구매빈도",
        thumbnail: "https://picsum.photos/id/1015/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["TGI"],
        tags: ["예시","global"],
        attachments: [
          { name: "TGI_table.csv", url: "https://example.com/tgi_table.csv", kind: "table" },
          { name: "TGI_graph.png", url: "https://picsum.photos/id/1003/1200/800", kind: "graph" }
        ],
        body: bodyJson({
          cards: [],
          blocks: [
            {
              type: "reportOverview",
              title: "Global TGI Report",
              publisher: "AllMarketing Global",
              date: "2025-10-11",
              pages: "25",
              fileUrl: "https://example.com/tgi.pdf"
            }
          ]
        })
      }
    },

    // 7) RESOURCE — Summary + 첨부(Report/Infograph)
    {
      section: "resource",
      payload: {
        title: "Syndicate 샘플 데이터",
        summary: "제휴 리서치 요약 파일 제공",
        thumbnail: "https://picsum.photos/id/1019/600/400",
        displayType: "album",
        contentType: "summary",
        status: "published",
        categories: ["Syndicate"],
        tags: ["예시","resource"],
        attachments: [
          { name: "Syndicate_Summary.pdf", url: "https://example.com/syn.pdf", kind: "report" },
          { name: "Overview.png", url: "https://picsum.photos/id/1036/1200/800", kind: "infograph" }
        ],
        body: bodyJson({
          cards: [],
          blocks: [
            { type: "summary", text: "Syndicate 자료의 요약과 대표 인포그래픽을 제공합니다." }
          ]
        })
      }
    }
  ];

  const results = [];
  for (const { section, payload } of jobs) {
    process.stdout.write(`Seeding ${section} ... `);
    try {
      const res = await post(section, payload);
      results.push({ section, id: res.id });
      console.log(`OK (id=${res.id})`);
    } catch (err) {
      console.error(`FAILED\n${err?.message || err}`);
      results.push({ section, error: String(err) });
    }
  }

  console.log("\n=== Seed Result ===");
  for (const r of results) {
    if (r.error) console.log(`- ${r.section}: ERROR -> ${r.error}`);
    else console.log(`- ${r.section}: created id=${r.id}`);
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
