/** @jsxImportSource react */
import { absoluteUrl, jsonLd, siteName, siteDescription } from "@/lib/seo";
import type { CatalogProduct } from "@/lib/catalog";
export function StructuredData({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
export const organization = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: siteName,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/images/nha-logo.svg"),
  description: siteDescription,
};
export function BreadcrumbData({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}
export function ProductData({ product: p }: { product: CatalogProduct }) {
  const images = [
    ...new Set(
      [
        p.image,
        ...p.media.filter((m) => m.type === "image").map((m) => m.src),
      ].filter(Boolean),
    ),
  ];
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": absoluteUrl(`/san-pham/${p.slug}#product`),
        url: absoluteUrl(`/san-pham/${p.slug}`),
        name: p.name,
        description: p.description || undefined,
        sku: p.sku,
        model: p.model || undefined,
        brand:
          p.brand && p.brand !== "Chưa xác định"
            ? { "@type": "Brand", name: p.brand }
            : undefined,
        image: images.length ? images.map(absoluteUrl) : undefined,
        additionalProperty: p.specifications.length
          ? p.specifications.map((s) => ({
              "@type": "PropertyValue",
              name: s.name,
              value: s.value,
              unitText: s.unit || undefined,
            }))
          : undefined,
      }}
    />
  );
}
