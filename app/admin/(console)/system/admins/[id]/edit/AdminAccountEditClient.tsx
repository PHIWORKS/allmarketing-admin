"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAccountForm from "@/components/admin/system/AdminAccountForm";
import type { AdminAccount } from "@/lib/adminAccounts.store";

export default function AdminAccountEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<AdminAccount | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/admin/system/admins/${encodeURIComponent(id)}`);
        if (!r.ok) throw new Error("불러오기에 실패했습니다");
        const j: AdminAccount = await r.json();
        if (alive) setItem(j);
      } catch {
        if (alive) setErr("불러오기에 실패했습니다");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">관리자계정 · 수정</h1>
      <AdminAccountForm
        initial={item}
        onSaved={() => {
          router.replace("/admin/(console)/system/admins");
        }}
      />
    </div>
  );
}
