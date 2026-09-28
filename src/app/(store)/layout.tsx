import { Header, Footer } from "@/components/store";
import { repository } from "@/lib/repository";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await repository.getCategories();
  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer catalogueCategories={categories} />
    </>
  );
}
