import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";
import { repository } from "@/lib/repository";
import { siteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    repository.getProducts(),
    repository.getCategories(),
  ]);
  return [
    "",
    "/san-pham",
    "/gioi-thieu",
    "/lien-he",
    "/tin-tuc",
    ...products.map((p) => `/san-pham/${p.slug}`),
    ...categories.map((c) => `/danh-muc/${c.slug}`),
    ...articles.map((a) => `/tin-tuc/${a.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
