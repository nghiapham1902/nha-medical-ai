import { test, expect } from "@playwright/test";

test("responsive public pages and login", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/san-pham",
      "/gioi-thieu",
      "/lien-he",
      "/tin-tuc",
      "/dang-nhap",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} ${width}`,
      ).toBeTruthy();
    }
  }
});
test("anonymous visitors cannot access dashboard or CRUD", async ({
  page,
  request,
  baseURL,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dang-nhap/);
  for (const resource of ["categories", "products"]) {
    const read = await request.get(`/api/admin/${resource}`);
    expect([401, 503]).toContain(read.status());
    for (const method of ["POST", "PUT", "DELETE"]) {
      const result = await request.fetch(`/api/admin/${resource}`, {
        method,
        headers: { Origin: new URL(baseURL!).origin },
        data: { name: "untrusted" },
      });
      expect([401, 503]).toContain(result.status());
    }
  }
  const csrf = await request.post("/api/admin/categories", {
    headers: { Origin: "https://other.example" },
    data: {},
  });
  expect(csrf.status()).toBe(400);
  const forged = await request.get("/api/admin/products", {
    headers: { Cookie: "sb-fake-auth-token=forged" },
  });
  expect([401, 503]).toContain(forged.status());
});
test("SEO and missing category/product routes", async ({ request }) => {
  for (const route of ["/sitemap.xml", "/robots.txt", "/opengraph-image"])
    expect((await request.get(route)).status()).toBe(200);
  for (const route of [
    "/san-pham/khong-ton-tai",
    "/danh-muc/khong-ton-tai",
    "/san-pham?category=khong-ton-tai",
  ]) {
    const response = await request.get(route);
    expect([200, 404]).toContain(response.status());
    expect(await response.text()).toContain("noindex");
  }
  const html = await (await request.get("/san-pham")).text();
  expect(html).toContain('rel="canonical"');
  expect(html).toContain("og:title");
});
test("contact retains product and quote intent", async ({ page }) => {
  await page.goto("/lien-he?type=quote&product=Thi%E1%BA%BFt%20b%E1%BB%8B");
  await expect(
    page.getByRole("combobox", { name: "Nhu cầu", exact: true }),
  ).toHaveValue("Yêu cầu báo giá");
  await expect(page.getByLabel("Nội dung *")).toHaveValue("Sản phẩm: Thiết bị");
});
