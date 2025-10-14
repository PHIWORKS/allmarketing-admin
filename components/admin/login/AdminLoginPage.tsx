"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [remember, setRemember] = useState(true); // 세션 유지(쿠키 만료 길게)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") || "/admin";

  // 아이디 저장(로컬스토리지)
  useEffect(() => {
    const saved = localStorage.getItem("am_admin_id");
    if (saved) {
      setId(saved);
      setRememberId(true);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw, remember }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "로그인 실패");
      }

      if (rememberId) localStorage.setItem("am_admin_id", id);
      else localStorage.removeItem("am_admin_id");

      router.replace(next);
    } catch (e: unknown) {
        if (e instanceof Error) {
          setErr(e.message);
        } else {
          setErr(String(e));
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">
            AllMarketing <span className="text-emerald-600">Admin</span>
          </h1>
        </div>

        <form onSubmit={submit} className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="비밀번호를 입력하세요"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
          />

          <div className="flex items-center gap-5 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)} />
              아이디 저장
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              로그인 유지
            </label>
          </div>

          {err && <div className="text-sm text-rose-600">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-800 text-white py-2.5 hover:bg-sky-900 disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">데모 계정: admin / admin1234</p>
      </div>
    </div>
  );
}
