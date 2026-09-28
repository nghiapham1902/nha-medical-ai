import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function seo(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      locale: "vi_VN",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
