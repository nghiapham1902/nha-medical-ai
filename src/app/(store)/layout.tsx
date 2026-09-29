import { Header, Footer } from "@/components/store";
import { repository } from "@/lib/repository";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
async function CatalogueFooter() {
  const categories = await repository.getCategories();
  return <Footer catalogueCategories={categories} />;
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung
      </a>
      <Header />
      <main id="main">{children}</main>
      <Suspense fallback={<Footer catalogueCategories={[]} />}>
        <CatalogueFooter />
      </Suspense>
    </>
  );
}
