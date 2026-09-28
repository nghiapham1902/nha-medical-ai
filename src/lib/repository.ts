import "server-only";
import { cache } from "react";
import { articles } from "./data";
import { publicClient } from "./supabase/server";
import { toCatalogProduct, type Category, type ProductRecord } from "./catalog";
const getCategories = cache(async (): Promise<Category[]> => {
  const client = publicClient();
  if (!client) return [];
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order")
    .order("name");
  if (error) throw new Error("Không thể tải danh mục. Vui lòng thử lại sau.");
  return data as Category[];
});
const getProducts = cache(async (categoryId?: string) => {
  const client = publicClient();
  if (!client) return [];
  const categories = await getCategories();
  if (!categories.length) return [];
  let query = client
    .from("products")
    .select("*")
    .eq("status", "published")
    .in(
      "category_id",
      categories.map((c) => c.id),
    )
    .order("created_at", { ascending: false });
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw new Error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
  return (data as ProductRecord[]).map((row) =>
    toCatalogProduct(
      row,
      categories.find((c) => c.id === row.category_id)!,
    ),
  );
});
const getProduct = cache(async (slug: string) => {
  const client = publicClient();
  if (!client) return undefined;
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
  if (!data) return undefined;
  const category = (await getCategories()).find(
    (c) => c.id === data.category_id,
  );
  return category
    ? toCatalogProduct(data as ProductRecord, category)
    : undefined;
});
export const repository = {
  getCategories,
  getProducts,
  getProduct,
  getCategory: async (slug: string) =>
    (await getCategories()).find((c) => c.slug === slug),
  getArticles: async () => articles,
  getArticle: async (slug: string) => articles.find((a) => a.slug === slug),
};
