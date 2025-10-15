export type MemberGroup = {
  id: string;
  name: string;
  description?: string;
  roleDefault: "viewer" | "analyst" | "admin";
  permissions: string[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();

const seed: MemberGroup[] = [
  {
    id: "g-100",
    name: "기본",
    description: "최소 권한 그룹",
    roleDefault: "viewer",
    permissions: ["content:read"],
    memberCount: 24,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "g-200",
    name: "리서치",
    description: "리서치/애널리스트 팀",
    roleDefault: "analyst",
    permissions: ["content:read", "content:write", "reports:export"],
    memberCount: 8,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "g-300",
    name: "관리자",
    description: "전체 관리 권한",
    roleDefault: "admin",
    permissions: [
      "content:read",
      "content:write",
      "members:read",
      "members:write",
      "system:admin",
    ],
    memberCount: 3,
    createdAt: now(),
    updatedAt: now(),
  },
];

let rows: MemberGroup[] = [...seed];

export const GroupStore = {
  list() {
    return rows.slice().sort((a, b) => a.name.localeCompare(b.name));
  },
  get(id: string) {
    return rows.find((r) => r.id === id) || null;
  },
  create(input: Partial<MemberGroup>) {
    const item: MemberGroup = {
      id: crypto.randomUUID(),
      name: input.name || "(이름 없음)",
      description: input.description || "",
      roleDefault: (input.roleDefault as MemberGroup["roleDefault"]) || "viewer",
      permissions: Array.isArray(input.permissions) ? input.permissions : [],
      memberCount: input.memberCount ?? 0,
      createdAt: now(),
      updatedAt: now(),
    };
    rows.unshift(item);
    return item;
  },
  update(id: string, patch: Partial<MemberGroup>) {
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("not found");
    rows[idx] = {
      ...rows[idx],
      ...patch,
      updatedAt: now(),
    };
    return rows[idx];
  },
  remove(id: string) {
    rows = rows.filter((r) => r.id !== id);
  },
};
