import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data";
import { repository } from "@/lib/repository";
import { seo, jsonLd } from "@/lib/seo";
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
  return a
    ? seo(a.title, a.excerpt, `/tin-tuc/${a.slug}`)
    : { title: "Không tìm thấy bài viết" };
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
  return (
    <article className="container article-detail section">
      <div className="breadcrumbs">
        <Link href="/tin-tuc">Tin tức & kiến thức</Link> / {a.category}
      </div>
      <span className="eyebrow">{a.category}</span>
      <h1>{a.title}</h1>
      <p className="article-meta">
        {a.date} · Ban biên tập demo NHA Medical · 3 phút đọc
      </p>
      <Image
        src={a.image}
        alt={`${a.title} — ảnh minh họa`}
        width={1000}
        height={520}
        priority
      />
      <p className="article-lead">{a.excerpt}</p>
      <div className="notice">
        Bài viết demo cung cấp thông tin tổ chức chung, không thay thế hướng dẫn
        chuyên môn hoặc tài liệu nhà sản xuất.
      </div>
      <h2>{c[0]}</h2>
      <p>{c[1]}</p>
      <h2>{c[2]}</h2>
      <p>{c[3]}</p>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            image: a.image,
            datePublished: `2026-09-${a.date.slice(0, 2)}T08:00:00+07:00`,
            author: {
              "@type": "Organization",
              name: "NHA Medical — nội dung demo",
            },
          }),
        }}
      />
    </article>
  );
}
