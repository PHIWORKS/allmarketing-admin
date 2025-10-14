"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import {
  LayoutDashboard, LibraryBig, Users, MailOpen, Megaphone, MessagesSquare,
  Settings, ChevronDown, ChevronRight
} from "lucide-react";

function Item({
  href, icon, label, active,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition hover:bg-gray-50 ${
        active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-gray-700"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function SubItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm transition ${
        active ? "text-emerald-700 bg-emerald-50" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  // 아코디언 열림 상태
  const [openContent, setOpenContent] = useState(true);
  const [openMembers, setOpenMembers] = useState(true);
  const [openSystem, setOpenSystem] = useState(true);

  // 현재 경로 하이라이트
  const isActive = (base: string) =>
    pathname === base || pathname.startsWith(base + "/");

  // 콘텐츠 7섹션
  const contentSections = useMemo(
    () => ([
      { label: "DATA365", href: "/admin/content/data365" },
      { label: "MARKET", href: "/admin/content/market" },
      { label: "CONSUMER", href: "/admin/content/consumer" },
      { label: "BRANDS", href: "/admin/content/brands" },
      { label: "MEDIA", href: "/admin/content/media" },
      { label: "GLOBAL", href: "/admin/content/global" },
      { label: "RESOURCE", href: "/admin/content/resource" },
    ]),
    []
  );

  return (
    <aside className="col-span-12 md:col-span-3 lg:col-span-2">
      <nav className="rounded-2xl bg-white border shadow-sm p-2">

        {/* 대시보드 */}
        <Item
          href="/admin"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="대시보드"
          active={pathname === "/admin"}
        />

        {/* 콘텐츠 관리 */}
        <button
          onClick={() => setOpenContent(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <LibraryBig className="w-5 h-5" />
            <span className="font-medium">콘텐츠 관리</span>
          </div>
          {openContent ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openContent && (
          <div className="ml-8 mt-1 flex flex-col">
            {contentSections.map(s => (
              <SubItem key={s.href} href={s.href} label={s.label} active={isActive(s.href)} />
            ))}
          </div>
        )}

        {/* 회원 관리 */}
        <button
          onClick={() => setOpenMembers(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" />
            <span className="font-medium">회원 관리</span>
          </div>
          {openMembers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openMembers && (
          <div className="ml-8 mt-1 flex flex-col">
            <SubItem href="/admin/members" label="회원 목록" active={isActive("/admin/members")} />
            <SubItem href="/admin/members/groups" label="권한 그룹 관리" active={isActive("/admin/members/groups")} />
            <SubItem href="/admin/members/subscribers" label="구독자 관리" active={isActive("/admin/members/subscribers")} />
          </div>
        )}

        {/* 뉴스레터 관리 */}
        <Item
          href="/admin/newsletters"
          icon={<MailOpen className="w-5 h-5" />}
          label="뉴스레터 관리"
          active={isActive("/admin/newsletters")}
        />

        {/* 배너 관리 */}
        <Item
          href="/admin/banners"
          icon={<Megaphone className="w-5 h-5" />}
          label="배너 관리"
          active={isActive("/admin/banners")}
        />

        {/* 문의/자료요청 관리 */}
        <Item
          href="/admin/inquiries"
          icon={<MessagesSquare className="w-5 h-5" />}
          label="문의/자료요청 관리"
          active={isActive("/admin/inquiries")}
        />

        {/* 시스템 관리 */}
        <button
          onClick={() => setOpenSystem(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Settings className="w-5 h-5" />
            <span className="font-medium">시스템 관리</span>
          </div>
          {openSystem ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openSystem && (
          <div className="ml-8 mt-1 flex flex-col">
            <SubItem href="/admin/system/basics" label="기본정보" active={isActive("/admin/system/basics")} />
            <SubItem href="/admin/system/footer-pages" label="하단메뉴" active={isActive("/admin/system/footer-pages")} />
            <SubItem href="/admin/system/family-sites" label="Family Site" active={isActive("/admin/system/family-sites")} />
            <SubItem href="/admin/system/admins" label="관리자계정" active={isActive("/admin/system/admins")} />
          </div>
        )}

        {/* (요청에 없던 메뉴 제거됨: 카테고리/태그, 감사로그/백업, 통계 등) */}
      </nav>
    </aside>
  );
}