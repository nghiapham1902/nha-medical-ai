import { test, expect } from "@playwright/test";
import {
  normalizeSiteUrl,
  articleDate,
  jsonLd,
  validModified,
  productTitle,
} from "../src/lib/seo";
import {
  catalogQuery,
  filterProducts,
  catalogHref,
  pageSize,
} from "../src/lib/catalog-query";
import type { CatalogProduct } from "../src/lib/catalog";

test("SEO origin prevents localhost production and normalizes domain migrations", () => {
  expect(normalizeSiteUrl("http://medical.example/", true)).toBe(
    "https://medical.example",
  );
  for (const value of [
    undefined,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://medical.example/path",
    "https://a:b@medical.example",
  ])
    expect(() => normalizeSiteUrl(value, true)).toThrow();
  expect(normalizeSiteUrl(undefined, false)).toBe("http://localhost:3000");
  expect(articleDate("18/09/2026")).toBe("2026-09-18");
  expect(articleDate("31/02/2026")).toBeUndefined();
  expect(validModified("invalid")).toBeUndefined();
  expect(jsonLd({ text: "</script><script>alert(1)</script>" })).not.toContain(
    "<",
  );
  expect(
    productTitle({
      name: "ZEISS Axiolab 5",
      model: "Axiolab 5",
      brand: "ZEISS",
    }),
  ).toBe("ZEISS Axiolab 5");
});

test("pagination preserves filters, rejects malformed pages and has stable ordering", () => {
  const products = Array.from(
    { length: 13 },
    (_, i) =>
      ({
        name: `Product ${i}`,
        sku: `SKU${i}`,
        model: "M",
        brand: " ZEISS ",
        created_at: "2026-09-01",
        slug: `p-${String(i).padStart(2, "0")}`,
      }) as CatalogProduct,
  );
  const filtered = filterProducts(
    products.reverse(),
    "Product",
    "zeiss",
    "new",
  );
  expect(filtered.slice(pageSize, 2 * pageSize).map((p) => p.slug)).toEqual([
    "p-06",
    "p-07",
    "p-08",
    "p-09",
    "p-10",
    "p-11",
  ]);
  const href = catalogHref("/san-pham", 2, "A & B", "zeiss", "name");
  const state = catalogQuery(
    Object.fromEntries(new URL(href, "https://example.test").searchParams),
  );
  expect(state).toMatchObject({
    page: 2,
    query: "A & B",
    brand: "zeiss",
    sort: "name",
    filtered: true,
    valid: true,
  });
  for (const page of [
    "0",
    "-1",
    "abc",
    "1.5",
    "999999999999999999",
    ["1", "2"],
  ])
    expect(catalogQuery({ page }).valid).toBe(false);
  expect(catalogHref("/san-pham", 1)).toBe("/san-pham");
});

test("production server HTML contains canonical metadata, schemas and crawlable pagination without JS", async ({
  browser,
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => new URL(m[1]),
  );
  expect(urls.length).toBeGreaterThanOrEqual(8);
  expect(
    urls.every(
      (url) => url.protocol === "https:" && url.hostname === urls[0].hostname,
    ),
  ).toBe(true);
  expect(xml).not.toMatch(
    /<priority>|<changefreq>|localhost|\/dashboard|\/dang-nhap|\/api\//,
  );
  const product = urls.find((url) => url.pathname.startsWith("/san-pham/"));
  const category = urls.find((url) => url.pathname.startsWith("/danh-muc/"));
  const article = urls.find((url) => url.pathname.startsWith("/tin-tuc/"));
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    baseURL: test.info().project.use.baseURL,
  });
  const page = await context.newPage();
  try {
    for (const route of [
      "/",
      "/san-pham",
      "/gioi-thieu",
      "/lien-he",
      "/tin-tuc",
      ...[product, category, article]
        .filter(Boolean)
        .map((url) => url!.pathname),
    ]) {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
      const canonical = await page
        .locator('head link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical!).href).toBe(
        new URL(route, urls[0].origin).href,
      );
      for (const selector of [
        "head title",
        'head meta[name="description"]',
        'head meta[property="og:title"]',
        'head meta[property="og:description"]',
        'head meta[property="og:url"]',
      ])
        await expect(page.locator(selector), route).toHaveCount(1);
      expect(
        await page.locator('meta[name="robots"]').getAttribute("content"),
      ).not.toContain("noindex");
      expect(await page.title()).not.toMatch(/demo/i);
      const schemas = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const values = schemas.map((text) => JSON.parse(text));
      if (route === "/")
        expect(
          values[0]["@graph"].map((s: { "@type": string }) => s["@type"]),
        ).toEqual(["Organization", "WebSite"]);
      if (route === product?.pathname) {
        const schema = values.find((s) => s["@type"] === "Product");
        expect(schema.url).toBe(new URL(route, urls[0].origin).href);
        expect(JSON.stringify(schema)).not.toMatch(
          /"offers"|"aggregateRating"|"review"/,
        );
        expect(
          (schema.image || []).every((src: string) => /^https:\/\//.test(src)),
        ).toBe(true);
        expect(
          values.find((s) => s["@type"] === "BreadcrumbList").itemListElement,
        ).toHaveLength(4);
      }
      if (route === article?.pathname) {
        expect(
          await page
            .locator('meta[property="og:type"]')
            .getAttribute("content"),
        ).toBe("article");
        const schema = values.find((s) => s["@type"] === "Article");
        expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(schema.dateModified).toBeUndefined();
        expect(schema.publisher.name).toBe("NHA Medical");
      }
    }
    await page.goto("/san-pham", { waitUntil: "domcontentloaded" });
    const second = page.getByRole("link", { name: "Trang 2", exact: true });
    if (await second.count()) {
      const firstLinks = await page
        .locator(".catalog-products .product-image")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
      await page.goto((await second.getAttribute("href"))!, {
        waitUntil: "domcontentloaded",
      });
      expect(new URL(page.url()).searchParams.get("page")).toBe("2");
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${urls[0].origin}/san-pham?page=2`,
      );
      const nextLinks = await page
        .locator(".catalog-products .product-image")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
      expect(nextLinks.length).toBeGreaterThan(0);
      expect(nextLinks.some((link) => firstLinks.includes(link))).toBe(false);
    }
    await page.goto("/san-pham?q=ZEISS", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    for (const route of ["/dang-nhap", "/dang-ky"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
    }
    for (const route of [
      "/san-pham/seo-does-not-exist",
      "/danh-muc/seo-does-not-exist",
      "/san-pham?page=999999",
      "/san-pham?page=abc",
      "/tin-tuc/seo-does-not-exist",
    ]) {
      expect(
        (await page.goto(route, { waitUntil: "domcontentloaded" }))?.status(),
        route,
      ).toBe(404);
    }
  } finally {
    await context.close();
  }
});

test("catalogue pagination and filters still work with JavaScript", async ({
  page,
}) => {
  await page.goto("/san-pham", { waitUntil: "domcontentloaded" });
  const second = page.getByRole("link", { name: "Trang 2", exact: true });
  if (await second.count()) {
    await second.click();
    await expect(page).toHaveURL(/\?page=2$/);
    await expect(
      page.getByRole("link", { name: "Trang 2", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: "Trang 2", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  }
  await page
    .getByRole("textbox", { name: "Tìm sản phẩm", exact: true })
    .fill("__seo_no_matching_product__");
  await expect(page.locator(".result-count")).toHaveText("0 sản phẩm");
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await expect(
    page.getByRole("textbox", { name: "Tìm sản phẩm", exact: true }),
  ).toHaveValue("");
  await page
    .getByRole("combobox", { name: "Sắp xếp", exact: true })
    .selectOption("name");
  await expect(
    page.getByRole("combobox", { name: "Sắp xếp", exact: true }),
  ).toHaveValue("name");
  await page.goto("/san-pham?q=ZEISS&brand=zeiss&sort=name", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("textbox", { name: "Tìm sản phẩm", exact: true }),
  ).toHaveValue("ZEISS");
  await expect(
    page.getByRole("combobox", { name: "Sắp xếp", exact: true }),
  ).toHaveValue("name");
});
