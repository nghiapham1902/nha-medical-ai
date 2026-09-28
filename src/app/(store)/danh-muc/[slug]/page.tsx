import Link from "next/link";
import { notFound } from "next/navigation";
import { repository } from "@/lib/repository";
import { Catalog } from "@/components/catalog";
import { PageHeading } from "@/components/page-heading";
import { seo } from "@/lib/seo";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const c = await repository.getCategory((await params).slug);
  return c
    ? seo(c.name, c.description, `/danh-muc/${c.slug}`)
    : { title: "Không tìm thấy danh mục" };
}
export default async function Page({ params }: Props) {
  const category = await repository.getCategory((await params).slug);
  if (!category) notFound();
  const [products, categories] = await Promise.all([
    repository.getProducts(category.id),
    repository.getCategories(),
  ]);
  return (
    <>
      <PageHeading title={category.name} subtitle={category.description} />
      <section className="container section">
        <nav className="breadcrumbs" aria-label="Đường dẫn">
          <Link href="/san-pham">Sản phẩm</Link> /{" "}
          <span aria-current="page">{category.name}</span>
        </nav>
        <Catalog
          key={category.id}
          products={products}
          categories={categories}
          selected={category.slug}
        />
      </section>
    </>
  );
}
