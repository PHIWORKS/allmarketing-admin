// lib/newsletters.store.ts
export type Newsletter = {
  id: string;
  title: string;
  subject: string;
  segment?: string;
  status: "draft" | "scheduled" | "sent";
  sendAt?: string | null;
  body: string;
  createdAt: string;
};

// 전역 보강: globalThis에 타입을 안전하게 지정
type GlobalWithNL = typeof globalThis & {
  __NEWSLETTERS__?: Newsletter[];
};

const g = globalThis as GlobalWithNL;

if (!g.__NEWSLETTERS__) {
  g.__NEWSLETTERS__ = [
    {
      id: "1",
      title: "10월 둘째주 마케팅 인사이트",
      subject: "[위클리] 10월 2주 차 인사이트 모음",
      segment: "구독자",
      status: "sent",
      sendAt: "2025-10-10T09:00",
      body: "<h1>Hi</h1>",
      createdAt: "2025-10-09T12:00:00",
    },
    {
      id: "2",
      title: "신규 기능 안내",
      subject: "[공지] 관리자 콘솔 신규 기능",
      segment: "멤버",
      status: "scheduled",
      sendAt: "2025-10-20T09:00",
      body: "<p>내용</p>",
      createdAt: "2025-10-14T11:00:00",
    },
    {
      id: "3",
      title: "테스트 초안",
      subject: "테스트 subject",
      status: "draft",
      sendAt: null,
      body: "",
      createdAt: "2025-10-14T13:30:00",
    },
  ];
}

export const NEWSLETTERS = g.__NEWSLETTERS__ as Newsletter[];

// helpers
export function listNewsletters(opts: {
  q?: string;
  status?: "" | Newsletter["status"];
  page: number;
  size: number;
}) {
  const { q = "", status = "", page, size } = opts;
  let rows = NEWSLETTERS.filter(
    (n) =>
      (!q ||
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)) &&
      (!status || n.status === status)
  );
  const total = rows.length;
  rows = rows.slice((page - 1) * size, page * size);
  return { total, rows };
}

export function createNewsletter(body: Partial<Newsletter>) {
  const item: Newsletter = {
    id: String(Date.now()),
    title: body.title ?? "",
    subject: body.subject ?? "",
    segment: body.segment || undefined,
    status: (body.status as Newsletter["status"]) ?? "draft",
    sendAt: (body.sendAt as string | null) ?? null,
    body: body.body ?? "",
    createdAt: new Date().toISOString(),
  };
  NEWSLETTERS.unshift(item);
  return item;
}

export function getNewsletter(id: string) {
  return NEWSLETTERS.find((n) => n.id === id);
}

export function updateNewsletter(id: string, patch: Partial<Newsletter>) {
  const i = NEWSLETTERS.findIndex((n) => n.id === id);
  if (i < 0) return null;
  NEWSLETTERS[i] = { ...NEWSLETTERS[i], ...patch };
  return NEWSLETTERS[i];
}
