import type { CatalogProduct } from "./catalog";
export const pageSize = 6;
export type CatalogSearchParams = Record<string, string | string[] | undefined>;
export function brandLabel(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}
export function brandKey(value: string) {
  return brandLabel(value).toLocaleLowerCase("vi");
}
export function catalogQuery(params: CatalogSearchParams) {
  const single = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const rawPage = single("page");
  const page =
    rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : rawPage ? NaN : 1;
  return {
    query: single("q"),
    brand: brandKey(single("brand")),
    sort: single("sort") === "name" ? "name" : "new",
    page,
    valid:
      Number.isSafeInteger(page) &&
      page > 0 &&
      !Object.values(params).some(Array.isArray),
    filtered: Object.keys(params).some((k) => k !== "page"),
    category: single("category"),
  };
}
export function filterProducts(
  products: CatalogProduct[],
  query: string,
  brand: string,
  sort: string,
) {
  return products
    .filter(
      (p) =>
        (!brand || brandKey(p.brand) === brand) &&
        `${p.name} ${p.sku} ${p.model}`
          .toLocaleLowerCase("vi")
          .includes(query.toLocaleLowerCase("vi")),
    )
    .sort(
      (a, b) =>
        (sort === "name"
          ? a.name.localeCompare(b.name, "vi")
          : b.created_at.localeCompare(a.created_at)) ||
        a.slug.localeCompare(b.slug),
    );
}
export function catalogHref(
  path: string,
  page: number,
  query = "",
  brand = "",
  sort = "new",
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query) params.set("q", query);
  if (brand) params.set("brand", brand);
  if (sort !== "new") params.set("sort", sort);
  return `${path}${params.size ? `?${params}` : ""}`;
}
