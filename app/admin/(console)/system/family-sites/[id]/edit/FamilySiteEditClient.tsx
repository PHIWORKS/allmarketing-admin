"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FamilySiteForm from "@/components/admin/system/FamilySiteForm";
import type { FamilySite } from "@/lib/familySites.store";

export default function FamilySiteEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<FamilySite | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/admin/system/family-sites/${encodeURIComponent(id)}`);
        if (!r.ok) throw new Error("불러오기에 실패했습니다");
        const j: FamilySite = await r.json();
        if (alive) setItem(j);
      } catch {
        if (alive) setErr("불러오기에 실패했습니다");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Family Site · 수정</h1>
      <FamilySiteForm
        initial={item}
        onSaved={() => {
          router.replace("/admin/(console)/system/family-sites");
        }}
      />
    </div>
  );
}
