// lib/memberStore.ts
export type MemberStatus = "active" | "invited" | "suspended";
export type MemberRole = "admin" | "analyst" | "viewer";

export interface Member {
  id: string;
  name: string;
  email: string;
  group?: string;              // 권한 그룹(선택)
  role: MemberRole;            // 역할
  status: MemberStatus;        // 상태
  joinedAt: string;            // 가입일(ISO)
  lastLoginAt?: string | null; // 최근접속
}

// ---- mock 데이터 ----
const names = [
  "운영자A","애널리스트B","애널리스트C","마케터D","마케터E","마케터F","운영보조G","기획자H",
  "디자이너I","데이터J","데이터K","에디터L","PM M","마케터N","마케터O","분석가P","운영자Q",
  "운영자R","스태프S","스태프T","스태프U","스태프V","스태프W","스태프X","스태프Y","스태프Z"
];

function todayMinus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

let AUTO_ID = 1000;

const DB: Member[] = Array.from({ length: 35 }).map((_, i) => {
  const name = names[i % names.length];
  const role: MemberRole = i % 10 === 0 ? "admin" : i % 3 === 0 ? "analyst" : "viewer";
  const status: MemberStatus = i % 13 === 0 ? "suspended" : i % 7 === 0 ? "invited" : "active";
  const group = ["기본", "리서치", "마케팅", "외부협력"][i % 4];
  return {
    id: String(++AUTO_ID),
    name,
    email: `${name.replace(/\s/g, "").toLowerCase()}@example.com`,
    group,
    role,
    status,
    joinedAt: todayMinus(60 - i),
    lastLoginAt: status === "invited" ? null : todayMinus(i),
  };
});

// ---- 쿼리/페이지네이션 ----
export function listMembers(search: URLSearchParams) {
  const q = (search.get("q") || "").trim().toLowerCase();
  const status = (search.get("status") || "") as MemberStatus | "";
  const group = search.get("group") || "";
  const page = Math.max(1, Number(search.get("page") || "1"));
  const size = Math.max(1, Number(search.get("size") || "10"));

  let rows = DB.slice().sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1));

  if (q) {
    rows = rows.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }
  if (status) rows = rows.filter((m) => m.status === status);
  if (group) rows = rows.filter((m) => (m.group || "") === group);

  const total = rows.length;
  const start = (page - 1) * size;
  rows = rows.slice(start, start + size);

  return { total, rows };
}

export function getMember(id: string) {
  return DB.find((m) => m.id === id) || null;
}

export function createMember(data: Omit<Member, "id" | "joinedAt">) {
  const item: Member = {
    ...data,
    id: String(++AUTO_ID),
    joinedAt: new Date().toISOString(),
  };
  DB.unshift(item);
  return item;
}

export function updateMember(id: string, patch: Partial<Member>) {
  const idx = DB.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  DB[idx] = { ...DB[idx], ...patch, id: DB[idx].id }; // id 고정
  return DB[idx];
}

export function removeMember(id: string) {
  const idx = DB.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  DB.splice(idx, 1);
  return true;
}
