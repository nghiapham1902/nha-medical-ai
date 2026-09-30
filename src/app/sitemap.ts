import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";
import { repository } from "@/lib/repository";
import { absoluteUrl, validModified } from "@/lib/seo";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    repository.getProducts(),
    repository.getCategories(),
  ]);
  const pages = [
    "",
    "/san-pham",
    "/gioi-thieu",
    "/lien-he",
    "/tin-tuc",
    ...articles.map((a) => `/tin-tuc/${a.slug}`),
  ].map((path) => ({ url: absoluteUrl(path) }));
  return [
    ...pages,
    ...products.map((p) => ({
      url: absoluteUrl(`/san-pham/${p.slug}`),
      lastModified: validModified(p.updated_at),
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/danh-muc/${c.slug}`),
      lastModified: validModified(c.updated_at),
    })),
  ];
}
