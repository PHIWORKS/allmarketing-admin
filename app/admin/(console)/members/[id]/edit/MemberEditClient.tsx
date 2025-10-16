"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MemberForm from "@/components/admin/members/MemberForm";
import type { Member } from "@/lib/members";

export default function MemberEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<Member | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/members/${id}`);
        if (!res.ok) throw new Error("불러오기에 실패했습니다");
        const j: Member = await res.json();
        if (alive) setItem(j);
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "에러");
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
      <h1 className="text-xl font-semibold">회원 수정</h1>
      <MemberForm
        initial={item}
        onSaved={() => router.replace("/admin/(console)/members")}
      />
    </div>
  );
}
