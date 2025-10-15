// lib/members.ts
export type MemberStatus = "active" | "inactive";
export type MemberRole = "admin" | "editor" | "viewer";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  group?: string;          // 소속 그룹(선택)
  role: MemberRole;
  status: MemberStatus;
  subscribed: boolean;     // 뉴스레터 등 구독 여부
  memo?: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const MEMBER_DEFAULTS: Partial<Member> = {
  role: "viewer",
  status: "active",
  subscribed: true,
};
