// lib/system.store.ts
export type SystemBasics = {
  siteName: string;
  siteTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;

  contactEmail: string;
  contactPhone?: string;
  address?: string;
  businessNo?: string;        // 사업자등록번호
  privacyOfficer?: string;    // 개인정보보호책임자

  sns?: {
    youtube?: string;
    instagram?: string;
    x?: string;               // X(Twitter)
    blog?: string;
    linkedin?: string;
  };

  footerHtml?: string;        // 하단 HTML(카피라이트 등)
  updatedAt: string;
};

// HMR에서도 유지되도록 전역에 저장
declare global {
  var __SYSTEM_BASICS__: SystemBasics | undefined;
}
const g = globalThis as typeof globalThis;

if (!g.__SYSTEM_BASICS__) {
  g.__SYSTEM_BASICS__ = {
    siteName: "AllMarketing",
    siteTagline: "모든 마케팅 인사이트를 한 곳에서",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "support@example.com",
    contactPhone: "02-000-0000",
    address: "서울시 어딘가 123",
    businessNo: "123-45-67890",
    privacyOfficer: "홍길동",
    sns: {
      youtube: "",
      instagram: "",
      x: "",
      blog: "",
      linkedin: "",
    },
    footerHtml: "© 2025 AllMarketing. All rights reserved.",
    updatedAt: new Date().toISOString(),
  };
}
export const SYSTEM_BASICS = g.__SYSTEM_BASICS__!;

export function getBasics(): SystemBasics {
  return SYSTEM_BASICS;
}

export function updateBasics(patch: Partial<SystemBasics>): SystemBasics {
  const now = new Date().toISOString();
  const merged: SystemBasics = {
    ...SYSTEM_BASICS,
    ...patch,
    sns: { ...(SYSTEM_BASICS.sns ?? {}), ...(patch.sns ?? {}) },
    updatedAt: now,
  };
  g.__SYSTEM_BASICS__ = merged;
  return merged;
}
