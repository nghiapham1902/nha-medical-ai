import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCatalogPage } from "@/lib/catalog-page";
import { catalogHref, type CatalogSearchParams } from "@/lib/catalog-query";
import { BreadcrumbData } from "@/components/structured-data";
import { Catalog } from "@/components/catalog";
import { PageHeading } from "@/components/page-heading";
import { seo } from "@/lib/seo";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { category: c, state } = await loadCatalogPage(
    searchParams,
    (await params).slug,
  );
  if (!c) notFound();
  return seo(
    `${c.name}${state.page > 1 ? ` – Trang ${state.page}` : ""}`,
    c.description.trim() ||
      `Tìm hiểu ${c.name.toLocaleLowerCase("vi")} tại NHA Medical. Tham khảo sản phẩm, thông số và trao đổi nhu cầu lựa chọn thiết bị phù hợp.`,
    catalogHref(`/danh-muc/${c.slug}`, state.filtered ? 1 : state.page),
    { noindex: state.filtered },
  );
}
export default async function Page({ params, searchParams }: Props) {
  const { category, products, categories, state } = await loadCatalogPage(
    searchParams,
    (await params).slug,
  );
  if (!category) notFound();
  return (
    <>
      <BreadcrumbData
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: category.name, path: `/danh-muc/${category.slug}` },
        ]}
      />
      <PageHeading title={category.name} subtitle={category.description} />
      <section className="container section">
        <nav className="breadcrumbs" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link> /{" "}
          <Link href="/san-pham">Sản phẩm</Link> /{" "}
          <span aria-current="page">{category.name}</span>
        </nav>
        <Catalog
          key={`${category.id}:${JSON.stringify(state)}`}
          products={products}
          categories={categories}
          selected={category.slug}
          initialQuery={state.query}
          initialBrand={state.brand}
          initialSort={state.sort}
          initialPage={state.page}
        />
      </section>
    </>
  );
}
