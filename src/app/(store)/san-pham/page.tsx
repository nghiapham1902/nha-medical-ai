import { Catalog } from "@/components/catalog";
import { CategoryTiles } from "@/components/category-tiles";
import { repository } from "@/lib/repository";
import { notFound, redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { PageHeading } from "@/components/page-heading";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Danh mục sản phẩm",
  "Khám phá thiết bị phòng thí nghiệm, vật tư y tế, dụng cụ xét nghiệm, hóa chất và bảo hộ.",
  "/san-pham",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const query = await searchParams;
  const [categories, products] = await Promise.all([
    repository.getCategories(),
    query.category ? Promise.resolve([]) : repository.getProducts(),
  ]);
  if (query.category) {
    const category = categories.find(
      (c) => c.slug === query.category || c.name === query.category,
    );
    if (!category) notFound();
    redirect(`/danh-muc/${category.slug}`);
  }
  return (
    <>
      <PageHeading
        title="Sản phẩm & giải pháp"
        subtitle="Lựa chọn thiết bị phù hợp. Đồng hành cùng chuyên môn của bạn."
      />
      <section className="container section">
        <div className="catalog-category-section">
          <h2>Danh mục sản phẩm</h2>
          <CategoryTiles categories={categories} />
        </div>
        <Catalog
          products={products}
          categories={categories}
          initialQuery={typeof query.q === "string" ? query.q : ""}
        />
      </section>
    </>
  );
}
