import { Catalog } from "@/components/catalog";
import { CategoryTiles } from "@/components/category-tiles";
import { loadCatalogPage } from "@/lib/catalog-page";
import { catalogHref, type CatalogSearchParams } from "@/lib/catalog-query";
import { PageHeading } from "@/components/page-heading";
import { seo } from "@/lib/seo";
type Props = { searchParams: Promise<CatalogSearchParams> };
export async function generateMetadata({ searchParams }: Props) {
  const { state } = await loadCatalogPage(searchParams);
  return seo(
    `Thiết bị y tế, phòng thí nghiệm & vật tư${state.page > 1 ? ` – Trang ${state.page}` : ""}`,
    "Tham khảo danh mục thiết bị y tế, thiết bị phòng thí nghiệm và vật tư tại NHA Medical. Tìm sản phẩm theo tên, model, hãng và nhu cầu sử dụng.",
    catalogHref("/san-pham", state.filtered ? 1 : state.page),
    { noindex: state.filtered },
  );
}
export default async function Page({ searchParams }: Props) {
  const { categories, products, state } = await loadCatalogPage(searchParams);
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
          key={JSON.stringify(state)}
          products={products}
          categories={categories}
          initialQuery={state.query}
          initialBrand={state.brand}
          initialSort={state.sort}
          initialPage={state.page}
        />
      </section>
    </>
  );
}
