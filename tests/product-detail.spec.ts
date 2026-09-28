import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductInformation } from "../src/components/product-information";
import type { ProductRecord } from "../src/lib/catalog";
const base: ProductRecord = {
  id: "test",
  name: "Thiết bị kiểm thử",
  slug: "test",
  sku: "TEST",
  model: "",
  brand: "",
  category_id: "test",
  description: "",
  image: "",
  media: [],
  documents: [],
  status: "published",
  introduction: "",
  applications: "",
  application_items: [],
  specifications: [],
  created_at: "",
  updated_at: "",
};
test("product detail hides missing sections", () => {
  const html = renderToStaticMarkup(
    createElement(ProductInformation, { product: base }),
  );
  expect(html).not.toContain("<h2");
  expect(html).not.toContain("<table");
});
test("product detail renders three sections in order, paragraphs, lists, units and groups", () => {
  const html = renderToStaticMarkup(
    createElement(ProductInformation, {
      product: {
        ...base,
        introduction: "Giới thiệu đã xác minh",
        applications: "Ứng dụng thực tế",
        application_items: ["Lưu ý lựa chọn"],
        specifications: [
          { name: "Thông số A", value: "10", unit: "mm", group: "Nhóm A" },
          { name: "Thông số B", value: "Có", unit: "", group: "" },
        ],
      },
    }),
  );
  expect(html.indexOf('id="gioi-thieu"')).toBeLessThan(
    html.indexOf('id="ung-dung"'),
  );
  expect(html.indexOf('id="ung-dung"')).toBeLessThan(
    html.indexOf('id="thong-so"'),
  );
  for (const value of [
    "Giới thiệu đã xác minh",
    "Ứng dụng thực tế",
    "Lưu ý lựa chọn",
    "10 mm",
    "Nhóm A",
  ])
    expect(html).toContain(value);
  expect(html.indexOf("Thông số A")).toBeLessThan(html.indexOf("Thông số B"));
});
test("product content is escaped, not executed as HTML", () => {
  const html = renderToStaticMarkup(
    createElement(ProductInformation, {
      product: { ...base, introduction: "<script>alert(1)</script>" },
    }),
  );
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
});
