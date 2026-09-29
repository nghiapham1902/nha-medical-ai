import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { articles } from "./data";
import { publicClient } from "./supabase/server";
import { toCatalogProduct, type Category, type ProductRecord } from "./catalog";
// Only anonymous catalogue reads are shared. Authenticated admin reads stay uncached.
const cacheOptions = { revalidate: 60, tags: ["public-catalog"] };
const projectKey = process.env.SUPABASE_URL ?? "unconfigured";
const getCategories = cache(
  unstable_cache(
    async (): Promise<Category[]> => {
      const client = publicClient();
      if (!client) return [];
      const { data, error } = await client
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("sort_order")
        .order("name");
      if (error)
        throw new Error("Không thể tải danh mục. Vui lòng thử lại sau.");
      return data as Category[];
    },
    ["catalog-categories", projectKey],
    cacheOptions,
  ),
);
const getProducts = cache(
  unstable_cache(
    async (categoryId?: string) => {
      const client = publicClient();
      if (!client) return [];
      let query = client
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (categoryId) query = query.eq("category_id", categoryId);
      const [{ data, error }, categories] = await Promise.all([
        query,
        getCategories(),
      ]);
      if (error)
        throw new Error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      const byId = new Map(
        categories.map((category) => [category.id, category]),
      );
      return (data as ProductRecord[]).flatMap((row) => {
        const category = byId.get(row.category_id);
        return category ? [toCatalogProduct(row, category)] : [];
      });
    },
    ["catalog-products", projectKey],
    cacheOptions,
  ),
);
const getProduct = cache(
  unstable_cache(
    async (slug: string) => {
      const client = publicClient();
      if (!client) return null;
      const [{ data, error }, categories] = await Promise.all([
        client
          .from("products")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle(),
        getCategories(),
      ]);
      if (error)
        throw new Error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      if (!data) return null;
      const category = categories.find((c) => c.id === data.category_id);
      return category ? toCatalogProduct(data as ProductRecord, category) : null;
    },
    ["catalog-product", projectKey],
    cacheOptions,
  ),
);
export const repository = {
  getCategories,
  getProducts,
  getProduct,
  getCategory: async (slug: string) =>
    (await getCategories()).find((c) => c.slug === slug),
  getArticles: async () => articles,
  getArticle: async (slug: string) => articles.find((a) => a.slug === slug),
};
