"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BannerForm from "@/components/admin/banners/BannerForm";
import type { Banner } from "@/lib/banners.store";

export default function BannerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [item, setItem] = useState<Banner | null>(null);

  // params 해제
  useEffect(() => {
    let alive = true;
    Promise.resolve(params).then((p) => {
      if (alive) setId(p.id);
    });
    return () => {
      alive = false;
    };
  }, [params]);

  // 데이터 fetch
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      const r = await fetch(`/api/admin/banners/${id}`);
      const j = await r.json();
      if (alive) setItem(j);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!id || !item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">배너 수정</h1>
      <BannerForm
        initial={item}
        onSaved={() => router.replace("/admin/(console)/banners")}
      />
    </div>
  );
}
