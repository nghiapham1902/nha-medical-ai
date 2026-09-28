import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

// Opt-in only: creates synthetic records in a DEDICATED disposable Supabase project.
const url = process.env.SUPABASE_TEST_URL;
const key = process.env.SUPABASE_TEST_PUBLISHABLE_KEY;
const adminEmail = process.env.SUPABASE_TEST_ADMIN_EMAIL;
const adminPassword = process.env.SUPABASE_TEST_ADMIN_PASSWORD;
const memberEmail = process.env.SUPABASE_TEST_MEMBER_EMAIL;
const memberPassword = process.env.SUPABASE_TEST_MEMBER_PASSWORD;
const enabled =
  process.env.RUN_SUPABASE_INTEGRATION === "1" &&
  !!url &&
  !!key &&
  !!adminEmail &&
  !!adminPassword &&
  !!memberEmail &&
  !!memberPassword;

test("Supabase CRUD, RLS, category lifecycle and public product sections", async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(
    !enabled,
    "Requires an explicitly configured disposable Supabase test project and admin/member accounts.",
  );
  test.setTimeout(180000);
  const token = randomUUID().slice(0, 8),
    slug = `integration-${token}`;
  const admin = createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const member = createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  expect(
    (
      await admin.auth.signInWithPassword({
        email: adminEmail!,
        password: adminPassword!,
      })
    ).error,
  ).toBeNull();
  expect(
    (
      await member.auth.signInWithPassword({
        email: memberEmail!,
        password: memberPassword!,
      })
    ).error,
  ).toBeNull();
  let categoryId = "",
    productId = "",
    otherId = "";
  const origin = new URL(baseURL!).origin;
  const expectMissing = async (path: string) => {
    const response = await request.get(path);
    expect([200, 404]).toContain(response.status());
    expect(await response.text()).toContain("noindex");
  };
  const categoryBody = {
    name: `Danh mục kiểm thử ${token}`,
    slug,
    description: "Dữ liệu kiểm thử, không dùng vận hành",
    icon: "Microscope",
    sort_order: 1,
    active: true,
  };
  const api = async (resource: string, method: string, data: unknown) =>
    page.request.fetch(`/api/admin/${resource}`, {
      method,
      headers: { Origin: origin },
      data,
    });
  try {
    await page.goto("/dang-nhap");
    await page.getByLabel("Email", { exact: true }).fill(adminEmail!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(adminPassword!);
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole("button", { name: "Danh mục", exact: true }).click();
    await page.getByRole("button", { name: "Thêm mới", exact: true }).click();
    await page.getByLabel("Tên danh mục *").fill(categoryBody.name);
    await page.getByLabel("Slug *").fill(slug);
    await page.getByLabel("Thứ tự hiển thị").fill("1");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByRole("status")).toContainText("Đã lưu");
    let category = (
      await admin.from("categories").select("*").eq("slug", slug).single()
    ).data!;
    expect(category).toBeTruthy();
    categoryId = category.id;
    const duplicate = await api("categories", "POST", categoryBody);
    expect(duplicate.status()).toBe(409);
    const second = await api("categories", "POST", {
      ...categoryBody,
      name: `Danh mục khác ${token}`,
      slug: `${slug}-other`,
      sort_order: 2,
    });
    expect(second.status()).toBe(201);
    otherId = (await second.json()).data.id;
    const payload = {
      name: `Sản phẩm kiểm thử ${token}`,
      slug: `${slug}-product`,
      sku: `TEST-${token.toUpperCase()}`,
      model: "",
      brand: "",
      category_id: categoryId,
      description: "Dữ liệu kiểm thử",
      image: "",
      media: [],
      documents: [],
      status: "draft",
      introduction: "Giới thiệu kiểm thử",
      applications: "Ứng dụng kiểm thử",
      application_items: ["Lựa chọn kiểm thử"],
      specifications: [
        {
          name: "Thông số kiểm thử",
          value: "10",
          unit: "mm",
          group: "Nhóm kiểm thử",
        },
      ],
    };
    const created = await api("products", "POST", payload);
    expect(created.status()).toBe(201);
    let product = (await created.json()).data;
    productId = product.id;
    expect((await api("products", "POST", payload)).status()).toBe(409);
    expect(
      (
        await api("products", "POST", {
          ...payload,
          slug: `${slug}-bad`,
          sku: `BAD-${token}`,
          image: "javascript:alert(1)",
        })
      ).status(),
    ).toBe(400);
    await expectMissing(`/san-pham/${payload.slug}`);
    expect(
      (await anon.from("products").select("*").eq("id", productId)).data,
    ).toEqual([]);
    expect(
      (await member.from("products").select("*").eq("id", productId)).data,
    ).toEqual([]);
    for (const client of [anon, member]) {
      expect(
        (
          await client
            .from("categories")
            .insert({ ...categoryBody, slug: `${slug}-unauthorized` })
        ).error,
      ).not.toBeNull();
      expect(
        (
          await client
            .from("products")
            .insert({
              ...payload,
              slug: `${slug}-unauthorized`,
              sku: `DENY-${token}`,
            })
        ).error,
      ).not.toBeNull();
      const update = await client
        .from("products")
        .update({ status: "published" })
        .eq("id", productId)
        .select();
      expect(update.error || update.data?.length === 0).toBeTruthy();
      const remove = await client
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .select();
      expect(remove.error || remove.data?.length === 0).toBeTruthy();
    }
    expect(
      (
        await member
          .from("catalog_admins")
          .insert({ user_id: (await member.auth.getUser()).data.user!.id })
      ).error,
    ).not.toBeNull();
    const deletion = await api("categories", "DELETE", {
      id: categoryId,
      updated_at: category.updated_at,
    });
    expect(deletion.status()).toBe(409);
    const published = await api("products", "PUT", {
      ...product,
      status: "published",
    });
    expect(published.status()).toBe(200);
    const stale = product;
    product = (await published.json()).data;
    expect(
      (await api("products", "PUT", { ...stale, name: "Stale edit" })).status(),
    ).toBe(409);
    await page.goto(`/san-pham/${payload.slug}`);
    await expect(page.locator("#gioi-thieu")).toContainText(
      payload.introduction,
    );
    await expect(page.locator("#ung-dung")).toContainText(payload.applications);
    await expect(page.locator("#thong-so")).toContainText("10 mm");
    expect(
      await page
        .locator(".pdp-sections section")
        .evaluateAll((es) => es.map((e) => e.id)),
    ).toEqual(["gioi-thieu", "ung-dung", "thong-so"]);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
    }
    await page
      .locator(".pdp-actions")
      .getByRole("link", { name: "Nhận báo giá" })
      .click();
    await expect(page.getByLabel("Nội dung *")).toHaveValue(
      `Sản phẩm: ${payload.name}`,
    );
    await page.goto(`/danh-muc/${slug}`);
    await expect(page.locator(".product-card")).toHaveCount(1);
    await page.goto(`/danh-muc/${slug}-other`);
    await expect(page.locator(".product-card")).toHaveCount(0);
    const hidden = await api("categories", "PUT", {
      ...category,
      active: false,
    });
    expect(hidden.status()).toBe(200);
    category = (await hidden.json()).data;
    await expectMissing(`/danh-muc/${slug}`);
    await expectMissing(`/san-pham/${payload.slug}`);
    expect(
      (await anon.from("products").select("*").eq("id", productId)).data,
    ).toEqual([]);
    expect(
      (
        await admin
          .from("products")
          .select("category_id")
          .eq("id", productId)
          .single()
      ).data?.category_id,
    ).toBe(categoryId);
    const moved = await api("products", "PUT", {
      ...product,
      category_id: otherId,
      introduction: "",
      applications: "",
      application_items: [],
      specifications: [],
    });
    expect(moved.status()).toBe(200);
    product = (await moved.json()).data;
    expect(
      (
        await api("categories", "DELETE", {
          id: categoryId,
          updated_at: category.updated_at,
        })
      ).status(),
    ).toBe(200);
    categoryId = "";
    await page.goto(`/san-pham/${payload.slug}`);
    await expect(page.locator(".pdp-sections section")).toHaveCount(0);
    expect(
      (
        await api("products", "DELETE", {
          id: productId,
          updated_at: product.updated_at,
        })
      ).status(),
    ).toBe(200);
    productId = "";
    await expectMissing(`/san-pham/${payload.slug}`);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await expect(page).toHaveURL(/\/dang-nhap/);
    expect((await api("products", "POST", payload)).status()).toBe(401);
    await page.getByLabel("Email", { exact: true }).fill(memberEmail!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(memberPassword!);
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("không có quyền");
  } finally {
    // Cleanup only records with this run's IDs, never shared/seed categories.
    if (productId) await admin.from("products").delete().eq("id", productId);
    if (categoryId)
      await admin.from("categories").delete().eq("id", categoryId);
    if (otherId) await admin.from("categories").delete().eq("id", otherId);
    await admin.auth.signOut();
    await member.auth.signOut();
  }
});
