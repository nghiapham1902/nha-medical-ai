import type { Metadata } from "next";
import type { CatalogProduct } from "./catalog";
export const siteName = "NHA Medical";
export const siteDescription =
  "Tìm hiểu thiết bị y tế, thiết bị phòng thí nghiệm và vật tư tại NHA Medical. Tham khảo thông tin sản phẩm và trao đổi nhu cầu tư vấn lựa chọn thiết bị phù hợp.";
export function normalizeSiteUrl(
  value: string | undefined,
  production: boolean,
) {
  if (!value?.trim() && production)
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds.");
  const url = new URL(value?.trim() || "http://localhost:3000");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path or credentials.",
    );
  if (production) {
    if (
      /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(url.hostname) ||
      url.hostname.endsWith(".localhost")
    )
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be a public production origin, not localhost.",
      );
    url.protocol = "https:";
  }
  return url.origin;
}
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NODE_ENV === "production",
);
export function absoluteUrl(path = "/") {
  const url = new URL(path, `${siteUrl}/`);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("SEO URLs must use HTTP(S) without credentials.");
  return url.href;
}
export function summary(value: string, max = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const shortened = text.slice(0, max - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > max * 0.6 ? boundary : undefined).trim()}…`;
}
export function seo(
  title: string,
  description: string,
  path: string,
  options: {
    image?: string;
    type?: "website" | "article";
    noindex?: boolean;
  } = {},
): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const image = absoluteUrl(options.image || "/opengraph-image");
  const url = absoluteUrl(path);
  return {
    title: { absolute: fullTitle },
    description: summary(description),
    alternates: { canonical: url },
    ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description: summary(description),
      url,
      siteName,
      locale: "vi_VN",
      type: options.type || "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary(description),
      images: [image],
    },
  };
}
export function productTitle(
  p: Pick<CatalogProduct, "name" | "model" | "brand">,
) {
  let title = p.name.trim();
  for (const part of [p.model, p.brand === "Chưa xác định" ? "" : p.brand]) {
    if (
      part &&
      !title.toLocaleLowerCase("vi").includes(part.toLocaleLowerCase("vi")) &&
      `${title} – ${part}`.length <= 85
    )
      title += ` – ${part}`;
  }
  return summary(title, 85);
}
export function productDescription(p: CatalogProduct) {
  return summary(
    p.description.trim() ||
      `${productTitle(p)}. ${p.application_items[0] || p.applications || "Tham khảo thông tin và thông số sản phẩm tại NHA Medical."} Trao đổi nhu cầu để lựa chọn thiết bị phù hợp.`,
  );
}
export function validModified(value: string) {
  return /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : undefined;
}
// Use the displayed editorial date, without inventing a publication time.
export function articleDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return undefined;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
    ? iso
    : undefined;
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
