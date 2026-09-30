import { NewsList } from "@/components/news";
import { PageHeading } from "@/components/page-heading";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Tin tức & kiến thức",
  "Góc tham khảo về lựa chọn thiết bị, quản lý vật tư và tổ chức phòng thí nghiệm. Nội dung cần được đối chiếu với tài liệu và hướng dẫn chuyên môn.",
  "/tin-tuc",
);
export default function Page() {
  return (
    <>
      <PageHeading
        title="Tin tức & kiến thức"
        subtitle="Cùng cập nhật, cùng sẻ chia, cùng phát triển."
      />
      <section className="container section">
        <NewsList />
      </section>
    </>
  );
}
