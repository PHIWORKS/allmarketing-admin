"use client";

import { useMemo } from "react";
import { KpiCard, Card, Table } from "@/components/admin/dashboard/DashboardWidgets";

export default function AdminDashboardPage() {
  const kpis = useMemo(
    () => [
      { title: "오늘 신규 게시물", value: 12, delta: +3 },
      { title: "이번 주 발행", value: 48 },
      { title: "회원 증가(주간)", value: 34, sub: "총 4,123명 / 유료 18%" },
      { title: "다운로드(주간)", value: 289 },
      { title: "미처리 문의", value: 5, sub: "진행 7 / 완료 12" },
      { title: "최근 뉴스레터", value: "42%", sub: "클릭 11%" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.title} {...k} />
        ))}
      </section>

      {/* 중단 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* ✅ 셀프클로징 금지: 자식이 있으므로 <Card ...> ... </Card> */}
          <Card title="콘텐츠 상태 분포">
            <div className="h-40 rounded-xl bg-gray-100 grid place-items-center text-gray-500">
              (차트 자리 – recharts)
            </div>
          </Card>

          <Card title="최근 등록 10건" cta={{ label: "전체보기", href: "/admin/content/data365" }}>
            <Table
              columns={["제목", "섹션", "작성자", "상태", "발행일"]}
              rows={Array.from({ length: 5 }).map((_, i) => [
                `9월 트렌드 리포트 ${i + 1}`,
                ["DATA365", "MARKET", "MEDIA"][i % 3],
                "운영자A",
                i % 2 ? "scheduled" : "draft",
                i % 2 ? "2025-10-15" : "—",
              ])}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="인기 콘텐츠 Top3 (7일)">
            <ul className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">가전시장 동향 {i + 1}</div>
                    <div className="text-xs text-gray-500">MARKET · 조회수 {1500 - i * 120}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="배너 만료 D-7">
            <Table
              columns={["제목", "위치", "종료일", "상태"]}
              rows={[
                ["메인 히어로 A", "메인", "2025-10-17", "노출"],
                ["사이드 배너 B", "우측", "2025-10-16", "비노출"],
              ]}
            />
          </Card>
        </div>
      </section>

      {/* 하단 */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="문의/자료요청" cta={{ label: "전체보기", href: "/admin/inquiries" }}>
          <Table
            columns={["유형", "제목", "이메일", "접수일", "상태", "담당자"]}
            rows={[
              ["자료문의", "TGI 샘플 요청", "user@ex.co", "2025-10-12", "신규", "운영자A"],
              ["조사의뢰", "광고효과 설문", "mark@ex.co", "2025-10-12", "진행", "운영자B"],
            ]}
          />
        </Card>

        <Card title="뉴스레터 예약/최근 발송" cta={{ label: "이동", href: "/admin/newsletters" }}>
          <ul className="space-y-3">
            {[
              { title: "주간 올마케팅 10/2호", meta: "예약 · 2025-10-15 09:00 · 대상 1,842" },
              { title: "주간 올마케팅 9/4호", meta: "발송 · 오픈 42% · 클릭 11%" },
            ].map((n) => (
              <li key={n.title} className="p-3 rounded-xl border bg-white flex items-center justify-between">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.meta}</div>
                </div>
                <a className="text-emerald-600 text-sm" href="/admin/newsletters">
                  상세
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
