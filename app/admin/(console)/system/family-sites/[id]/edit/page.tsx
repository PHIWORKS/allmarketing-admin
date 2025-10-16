import FamilySiteEditClient from "./FamilySiteEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FamilySiteEditClient id={id} />;
}
