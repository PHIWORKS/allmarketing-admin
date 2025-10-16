// lib/inquiries.store.ts
export type InquiryStatus = "new" | "in_progress" | "answered" | "closed";
export type InquiryType = "문의" | "자료요청";

export type Inquiry = {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  title: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  memo?: string;
};

// 전역 유지(HMR 포함)
declare global {
  var __INQUIRIES__: Inquiry[] | undefined;
}
const g = globalThis as typeof globalThis;

if (!g.__INQUIRIES__) {
  g.__INQUIRIES__ = [
    {
      id: "1",
      type: "문의",
      name: "홍길동",
      email: "gildong@example.com",
      company: "가나다(주)",
      phone: "010-1111-2222",
      title: "서비스 요금제 문의",
      message: "엔터프라이즈 요금제 기능 범위가 궁금합니다.",
      status: "new",
      createdAt: "2025-10-12T09:20:00",
      updatedAt: "2025-10-12T09:20:00",
    },
    {
      id: "2",
      type: "자료요청",
      name: "Jane",
      email: "jane@example.com",
      company: "ACME",
      title: "브랜드 리포트 샘플 요청",
      message: "최근 발간된 브랜드 리포트 샘플을 받을 수 있을까요?",
      status: "in_progress",
      createdAt: "2025-10-13T13:05:00",
      updatedAt: "2025-10-14T08:10:00",
      memo: "10/14 메일 회신, 샘플 전달",
    },
    {
      id: "3",
      type: "문의",
      name: "최마케",
      email: "marketer@example.com",
      title: "데이터 수집 주기 문의",
      message: "DATA365 업데이트 주기를 알고 싶습니다.",
      status: "answered",
      createdAt: "2025-10-14T10:00:00",
      updatedAt: "2025-10-14T15:30:00",
    },
  ];
}

export const INQUIRIES = g.__INQUIRIES__!;

export function listInquiries(opts: {
  q?: string;
  status?: InquiryStatus | "";
  page: number;
  size: number;
}) {
  const { q = "", status = "", page, size } = opts;
  let rows = INQUIRIES.filter((i) => {
    const okQ =
      !q ||
      [i.name, i.email, i.company ?? "", i.title, i.message]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase());
    const okStatus = !status || i.status === status;
    return okQ && okStatus;
  });
  const total = rows.length;
  rows = rows.slice((page - 1) * size, page * size);
  return { total, rows };
}

export function getInquiry(id: string) {
  return INQUIRIES.find((i) => i.id === id) || null;
}

export function createInquiry(body: Partial<Inquiry>): Inquiry {
  const now = new Date().toISOString();
  const item: Inquiry = {
    id: String(Date.now()),
    type: (body.type as InquiryType) ?? "문의",
    name: body.name ?? "",
    email: body.email ?? "",
    company: body.company,
    phone: body.phone,
    title: body.title ?? "",
    message: body.message ?? "",
    status: (body.status as InquiryStatus) ?? "new",
    createdAt: now,
    updatedAt: now,
    memo: body.memo,
  };
  INQUIRIES.unshift(item);
  return item;
}

export function updateInquiry(
  id: string,
  patch: Partial<Inquiry>
): Inquiry | null {
  const idx = INQUIRIES.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  INQUIRIES[idx] = {
    ...INQUIRIES[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return INQUIRIES[idx];
}
