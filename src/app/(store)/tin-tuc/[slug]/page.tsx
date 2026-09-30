import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data";
import { repository } from "@/lib/repository";
import { seo, absoluteUrl, articleDate } from "@/lib/seo";
import {
  StructuredData,
  BreadcrumbData,
  organization,
} from "@/components/structured-data";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = await repository.getArticle((await params).slug);
  if (!a) notFound();
  return seo(a.title, a.excerpt, `/tin-tuc/${a.slug}`, {
    type: "article",
    image: a.image,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = await repository.getArticle((await params).slug);
  if (!a) notFound();
  const content: Record<string, string[]> = {
    "lua-chon-thiet-bi-phong-thi-nghiem": [
      "Làm rõ nhu cầu sử dụng",
      "Liệt kê loại công việc, tần suất sử dụng, không gian lắp đặt và yêu cầu kết nối. Một bản yêu cầu rõ ràng giúp việc trao đổi với nhà cung cấp cụ thể hơn.",
      "Đối chiếu tài liệu trước khi lựa chọn",
      "Yêu cầu catalogue, hướng dẫn sử dụng, cấu hình báo giá và điều kiện bảo hành. Những thông tin chưa có tài liệu xác nhận cần được làm rõ trước khi đặt hàng.",
    ],
    "quan-ly-vat-tu-y-te": [
      "Tổ chức danh mục thống nhất",
      "Đặt mã nội bộ rõ ràng và ghi nhận tên vật tư, đơn vị tính, quy cách đóng gói. Dùng cùng một danh mục cho khâu mua hàng, nhập kho và cấp phát.",
      "Theo dõi hồ sơ và tồn kho",
      "Lưu thông tin lô, hạn dùng và hướng dẫn bảo quản theo tài liệu của nhà sản xuất. Quy trình chuyên môn cụ thể cần do người có trách nhiệm tại đơn vị phê duyệt.",
    ],
    "khong-gian-phong-thi-nghiem": [
      "Bắt đầu từ quy trình làm việc",
      "Ghi nhận luồng công việc và nhu cầu sử dụng chung của nhóm. Việc bố trí không gian cần được chuyên gia phù hợp đánh giá theo loại phòng thí nghiệm.",
      "Duy trì thông tin thiết bị",
      "Tập hợp tài liệu, lịch bảo trì theo hướng dẫn nhà sản xuất và người phụ trách từng thiết bị. Hồ sơ có tổ chức giúp các thành viên tìm đúng thông tin khi cần.",
    ],
  };
  const c = content[a.slug];
  const categories = await repository.getCategories();
  const relatedCategories = categories
    .filter((category) =>
      a.slug === "quan-ly-vat-tu-y-te"
        ? /vật tư/i.test(category.name)
        : /phòng thí nghiệm|kính hiển vi/i.test(category.name),
    )
    .slice(0, 3);
  return (
    <article className="container article-detail section">
      <BreadcrumbData
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Tin tức & kiến thức", path: "/tin-tuc" },
          { name: a.title, path: `/tin-tuc/${a.slug}` },
        ]}
      />
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link> /{" "}
        <Link href="/tin-tuc">Tin tức & kiến thức</Link> /{" "}
        <span aria-current="page">{a.title}</span>
      </nav>
      <span className="eyebrow">{a.category}</span>
      <h1>{a.title}</h1>
      <p className="article-meta">
        <time dateTime={articleDate(a.date)}>{a.date}</time> · NHA Medical · Nội
        dung tham khảo
      </p>
      <Image
        src={a.image}
        alt={`${a.title} — ảnh minh họa`}
        width={1000}
        height={520}
        priority
        sizes="(max-width: 768px) 100vw, 1000px"
      />
      <p className="article-lead">{a.excerpt}</p>
      <div className="notice">
        Bài viết cung cấp thông tin tham khảo chung, không thay thế hướng dẫn
        chuyên môn hoặc tài liệu nhà sản xuất.
      </div>
      <h2>{c[0]}</h2>
      <p>{c[1]}</p>
      <h2>{c[2]}</h2>
      <p>{c[3]}</p>
      {!!relatedCategories.length && (
        <section aria-label="Danh mục liên quan">
          <h2>Tham khảo danh mục thiết bị và vật tư</h2>
          {relatedCategories.map((category) => (
            <Link
              className="related-article"
              key={category.id}
              href={`/danh-muc/${category.slug}`}
            >
              {category.name} →
            </Link>
          ))}
        </section>
      )}
      <h2>Bài viết liên quan</h2>
      {articles
        .filter((x) => x.slug !== a.slug)
        .map((x) => (
          <Link
            key={x.slug}
            className="related-article"
            href={`/tin-tuc/${x.slug}`}
          >
            {x.title} →
          </Link>
        ))}
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          image: absoluteUrl(a.image),
          datePublished: articleDate(a.date),
          author: {
            "@type": "Organization",
            name: "NHA Medical",
            url: absoluteUrl("/"),
          },
          publisher: organization,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": absoluteUrl(`/tin-tuc/${a.slug}`),
          },
        }}
      />
    </article>
  );
}
