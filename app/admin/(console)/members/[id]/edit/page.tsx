"use client";

import { useEffect, useState } from "react";
import MemberForm from "@/components/admin/members/MemberForm";
import type { Member } from "@/lib/members";

export default function EditMemberPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Member | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/members/${params.id}`);
        if (!res.ok) throw new Error("불러오기에 실패했습니다");
        const j = await res.json();
        setItem(j);
      } catch (e: any) {
        setErr(e.message || "에러");
      }
    })();
  }, [params.id]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>로딩중…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">회원 수정</h1>
      <MemberForm
        initial={item}
        onSaved={() => {
          location.href = "/admin/(console)/members";
        }}
      />
    </div>
  );
}
