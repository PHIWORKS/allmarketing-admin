"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FooterPageForm from "@/components/admin/system/FooterPageForm";
import type { FooterPage } from "@/lib/footerPages.store";

export default function FooterPageEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<FooterPage | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/system/footer-pages/${encodeURIComponent(id)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j: FooterPage = await res.json();
        if (alive) setItem(j);
      } catch {
        if (alive) setErr("불러오기 실패");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">하단메뉴 · 페이지 수정</h1>
      <FooterPageForm
        initial={item}
        onSaved={() => router.replace("/admin/system/footer-pages")}
      />
    </div>
  );
}
