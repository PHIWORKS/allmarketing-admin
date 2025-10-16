// 서버 컴포넌트: params는 Promise 타입 (typed routes)
import MemberEditClient from "./MemberEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ 여기에서만 Promise 해제
  return <MemberEditClient id={id} />;
}
