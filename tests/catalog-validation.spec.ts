import { test, expect } from "@playwright/test";
import {
  validateCategory,
  validateProduct,
  validateUrl,
  validateVersion,
} from "../src/lib/catalog-validation";
import {
  toCatalogProduct,
  type Category,
  type ProductRecord,
} from "../src/lib/catalog";
export const category: Category = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Danh mục kiểm thử",
  slug: "danh-muc-kiem-thu",
  description: "",
  icon: "Microscope",
  sort_order: 10,
  active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};
export const product: ProductRecord = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Sản phẩm kiểm thử",
  slug: "san-pham-kiem-thu",
  sku: "TEST-1",
  model: "",
  brand: "",
  category_id: category.id,
  description: "",
  image: "",
  media: [],
  documents: [],
  status: "draft",
  introduction: "",
  applications: "",
  application_items: [],
  specifications: [],
  created_at: category.created_at,
  updated_at: category.updated_at,
};
test("category validation rejects invalid input and ignores protected fields", () => {
  expect(validateCategory(category)).toEqual({
    name: category.name,
    slug: category.slug,
    description: "",
    icon: "Microscope",
    sort_order: 10,
    active: true,
  });
  for (const change of [
    { name: " " },
    { slug: "Tên Không hợp lệ" },
    { slug: "../bad" },
    { icon: "script" },
    { sort_order: -1 },
    { sort_order: 1.5 },
    { active: "true" },
    { description: "x".repeat(1001) },
  ])
    expect(() => validateCategory({ ...category, ...change })).toThrow();
  expect(() => validateCategory(null)).toThrow();
});
test("product validation checks fields, arrays and strips untrusted writes", () => {
  const valid = validateProduct({
    ...product,
    sku: "abc-1",
    price: 100,
    created_at: "forged",
    id: "forged",
    specifications: [{ name: "Tên", value: "0", unit: "mm", group: "Nhóm" }],
  });
  expect(valid.sku).toBe("ABC-1");
  expect(valid).not.toHaveProperty("price");
  expect(valid).not.toHaveProperty("id");
  expect(valid).not.toHaveProperty("created_at");
  expect(valid.specifications[0].value).toBe("0");
  for (const change of [
    { name: "" },
    { sku: "A B" },
    { category_id: "missing" },
    { status: "approved" },
    { introduction: "x".repeat(20001) },
    { application_items: [""] },
    { specifications: [{ name: "", value: "1", unit: "", group: "" }] },
    {
      specifications: Array(201).fill({
        name: "a",
        value: "b",
        unit: "",
        group: "",
      }),
    },
    { media: [{ type: "image", src: "/images/a.png", alt: "" }] },
    { documents: [{ name: "", href: "/a.pdf" }] },
    { media: [{ type: "iframe", src: "https://example.com" }] },
  ])
    expect(() => validateProduct({ ...product, ...change })).toThrow();
  expect(() => validateVersion("not-a-date")).toThrow();
  expect(validateVersion(product.updated_at)).toBe(product.updated_at);
});
test("URLs reject scripts, protocol relative paths and credentials", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:image/svg+xml,test",
    "//evil.example/a",
    "https://user:pass@example.com/a",
    "http://example.com/a",
    "/../secret",
    "/%2e%2e/secret",
    "/\\evil",
    "https://example.com/has space",
  ])
    expect(() => validateUrl(url, true)).toThrow();
  for (const url of ["https://example.com/file.pdf", "/images/product.jpg", ""])
    expect(validateUrl(url)).toBe(url);
  expect(() => validateUrl("", true)).toThrow();
});
test("mapping keeps real media and does not invent product content", () => {
  expect(toCatalogProduct(product, category).media).toEqual([]);
  const row = {
    ...product,
    image: "/images/real.jpg",
    media: [
      { type: "image" as const, src: "/images/side.jpg", alt: "Góc bên" },
    ],
  };
  expect(toCatalogProduct(row, category).media?.map((m) => m.src)).toEqual([
    "/images/real.jpg",
    "/images/side.jpg",
  ]);
  expect(
    toCatalogProduct(
      { ...row, media: [{ type: "image", src: row.image, alt: "Ảnh chính" }] },
      category,
    ).media,
  ).toHaveLength(1);
});
