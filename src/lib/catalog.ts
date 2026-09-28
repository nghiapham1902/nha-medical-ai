import type { Product, ProductMedia } from "./data";
export const iconNames = [
  "Microscope",
  "Package",
  "HeartPulse",
  "TestTubes",
  "FlaskConical",
  "ShieldCheck",
] as const;
export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  icon: (typeof iconNames)[number];
  sort_order: number;
  active: boolean;
};
export type Category = CategoryInput & {
  id: string;
  created_at: string;
  updated_at: string;
};
export type Specification = {
  name: string;
  value: string;
  unit: string;
  group: string;
};
export type DocumentLink = { name: string; href: string };
export type ProductInput = {
  name: string;
  slug: string;
  sku: string;
  model: string;
  brand: string;
  category_id: string;
  description: string;
  image: string;
  media: ProductMedia[];
  documents: DocumentLink[];
  status: "draft" | "published";
  introduction: string;
  applications: string;
  application_items: string[];
  specifications: Specification[];
};
export type ProductRecord = ProductInput & {
  id: string;
  created_at: string;
  updated_at: string;
};
export type CatalogProduct = Omit<Product, "price" | "stock" | "popular"> &
  ProductRecord & { categorySlug: string };
export function toCatalogProduct(
  row: ProductRecord,
  category: Category,
): CatalogProduct {
  const media = [...row.media];
  if (
    row.image &&
    !media.some((item) => item.type === "image" && item.src === row.image)
  )
    media.unshift({ type: "image", src: row.image, alt: row.name });
  return {
    ...row,
    media,
    category: category.name,
    categorySlug: category.slug,
  };
}
