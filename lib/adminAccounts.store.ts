export type AdminRole = "owner" | "manager" | "editor" | "viewer";
export type AdminStatus = "active" | "suspended";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  memo?: string;
};

// HMR에서도 유지
declare global {
  var __ADMIN_ACCOUNTS__: AdminAccount[] | undefined;
}
const g = globalThis as typeof globalThis;

if (!g.__ADMIN_ACCOUNTS__) {
  g.__ADMIN_ACCOUNTS__ = [
    {
      id: "1",
      name: "Owner Kim",
      email: "owner@example.com",
      role: "owner",
      status: "active",
      createdAt: "2025-10-10T09:00:00",
      updatedAt: "2025-10-10T09:00:00",
      lastLoginAt: "2025-10-14T08:40:00",
      memo: "최고관리자",
    },
    {
      id: "2",
      name: "Manager Lee",
      email: "manager@example.com",
      role: "manager",
      status: "active",
      createdAt: "2025-10-11T10:00:00",
      updatedAt: "2025-10-12T12:00:00",
      lastLoginAt: null,
    },
    {
      id: "3",
      name: "Viewer Park",
      email: "viewer@example.com",
      role: "viewer",
      status: "suspended",
      createdAt: "2025-10-12T14:10:00",
      updatedAt: "2025-10-13T09:20:00",
    },
  ] as AdminAccount[];
}
export const ADMIN_ACCOUNTS = g.__ADMIN_ACCOUNTS__!;

export function listAdminAccounts() {
  // 최신 수정 순으로 정렬
  return [...ADMIN_ACCOUNTS].sort(
    (a, b) => b.updatedAt.localeCompare(a.updatedAt)
  );
}

export function getAdminAccount(id: string) {
  return ADMIN_ACCOUNTS.find((a) => a.id === id) || null;
}

export function createAdminAccount(body: Partial<AdminAccount>): AdminAccount {
  const now = new Date().toISOString();
  const item: AdminAccount = {
    id: String(Date.now()),
    name: body.name ?? "",
    email: body.email ?? "",
    role: (body.role as AdminRole) ?? "viewer",
    status: (body.status as AdminStatus) ?? "active",
    createdAt: now,
    updatedAt: now,
    lastLoginAt: body.lastLoginAt ?? null,
    memo: body.memo,
  };
  ADMIN_ACCOUNTS.unshift(item);
  return item;
}

export function updateAdminAccount(
  id: string,
  patch: Partial<AdminAccount>
): AdminAccount | null {
  const idx = ADMIN_ACCOUNTS.findIndex((a) => a.id === id);
  if (idx < 0) return null;
  ADMIN_ACCOUNTS[idx] = {
    ...ADMIN_ACCOUNTS[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return ADMIN_ACCOUNTS[idx];
}
