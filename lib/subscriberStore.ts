export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed" | "bounced" | "complained";
  source: "web" | "import" | "admin";
  tags: string[];
  joinedAt: string;
  lastActivityAt?: string | null;
};

const now = () => new Date().toISOString();

const seed: Subscriber[] = [
  {
    id: "s-100",
    email: "alice@example.com",
    name: "Alice",
    status: "active",
    source: "web",
    tags: ["weekly", "free"],
    joinedAt: now(),
    lastActivityAt: now(),
  },
  {
    id: "s-200",
    email: "bob@corp.com",
    name: "Bob",
    status: "unsubscribed",
    source: "import",
    tags: ["event"],
    joinedAt: now(),
    lastActivityAt: null,
  },
  {
    id: "s-300",
    email: "carol@example.com",
    name: "Carol",
    status: "active",
    source: "admin",
    tags: ["vip", "paid"],
    joinedAt: now(),
    lastActivityAt: now(),
  },
];

let rows: Subscriber[] = [...seed];

export const SubscriberStore = {
  list() {
    return rows.slice().sort((a, b) => a.email.localeCompare(b.email));
  },
  get(id: string) {
    return rows.find((r) => r.id === id) || null;
  },
  create(input: Partial<Subscriber>) {
    const item: Subscriber = {
      id: crypto.randomUUID(),
      email: input.email || "",
      name: input.name || "",
      status: (input.status as Subscriber["status"]) || "active",
      source: (input.source as Subscriber["source"]) || "admin",
      tags: Array.isArray(input.tags) ? input.tags : [],
      joinedAt: now(),
      lastActivityAt: input.lastActivityAt ?? null,
    };
    rows.unshift(item);
    return item;
  },
  update(id: string, patch: Partial<Subscriber>) {
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("not found");
    rows[idx] = {
      ...rows[idx],
      ...patch,
    };
    return rows[idx];
  },
  remove(id: string) {
    rows = rows.filter((r) => r.id !== id);
  },
};
