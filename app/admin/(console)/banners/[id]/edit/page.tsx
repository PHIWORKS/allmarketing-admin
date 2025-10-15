// 서버 컴포넌트: params는 Promise 타입 (typed routes)
import BannerEditClient from "./BannerEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;   // ✅ 여기서만 Promise 해제
  return <BannerEditClient id={id} />;
}
