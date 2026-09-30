import { Header, Footer } from "@/components/store";
import { repository } from "@/lib/repository";
export const revalidate = 60;
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Await public data before rendering: a fallback must not send HTTP 200 before notFound.
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
