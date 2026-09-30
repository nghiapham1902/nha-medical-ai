import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Target, Eye, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { CategoryTiles } from "@/components/category-tiles";
import { repository } from "@/lib/repository";
import { labImage } from "@/lib/data";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Về NHA Medical",
  "Tìm hiểu định hướng của NHA Medical về thiết bị y tế, phòng thí nghiệm và vật tư; trao đổi nhu cầu để lựa chọn giải pháp phù hợp cho đơn vị.",
  "/gioi-thieu",
);
export default async function Page() {
  const categories = await repository.getCategories();
  return (
    <>
      <PageHeading
        title="Về NHA Medical"
        subtitle="Kết nối khoa học. Đồng hành cùng sức khỏe."
      />
      <section className="container section">
        <div className="about-intro">
          <div>
            <span className="eyebrow">KHOA HỌC VÌ CON NGƯỜI</span>
            <h2>
              Một người đồng hành.
              <br />
              Nhiều giải pháp phù hợp.
            </h2>
            <p>
              NHA Medical định hướng cung cấp thiết bị phòng thí nghiệm, vật tư
              y tế và thiết bị y tế cho các đơn vị chuyên môn.
            </p>
            <p>
              Chúng tôi hướng tới trải nghiệm lựa chọn sản phẩm minh bạch, tư
              vấn theo nhu cầu và hỗ trợ trong suốt quá trình tìm hiểu giải
              pháp.
            </p>
            <p className="notice">
              Hồ sơ pháp lý, năng lực, khách hàng và đối tác cần được xác minh
              trước khi công bố.
            </p>
            <Link href="/lien-he" className="button primary">
              Kết nối với chúng tôi <ArrowRight size={17} />
            </Link>
          </div>
          <Image
            src={labImage}
            alt="Phòng thí nghiệm — ảnh minh họa"
            width={650}
            height={480}
          />
        </div>
        <div className="value-grid">
          {[
            [
              Target,
              "Sứ mệnh",
              "Hỗ trợ các đơn vị tiếp cận thiết bị và vật tư phù hợp với nhu cầu chuyên môn.",
            ],
            [
              Eye,
              "Tầm nhìn",
              "Xây dựng một điểm kết nối đáng tin cậy cho giải pháp y tế và khoa học.",
            ],
            [
              ShieldCheck,
              "Cam kết chất lượng",
              "Minh bạch tài liệu, xác nhận cấu hình và điều kiện cung ứng trước mỗi giao dịch.",
            ],
          ].map(([Icon, title, desc]) => {
            const I = Icon as typeof Target;
            return (
              <article key={String(title)}>
                <I />
                <h2>{String(title)}</h2>
                <p>{String(desc)}</p>
              </article>
            );
          })}
        </div>
        <div className="section-heading">
          <h2>Lĩnh vực hoạt động</h2>
        </div>
        <CategoryTiles categories={categories} />
        <section
          className="brand-section space-top"
          aria-labelledby="brands-title"
        >
          <span className="eyebrow">Y TẾ & KHOA HỌC</span>
          <h2 id="brands-title">Thương hiệu nổi bật</h2>
          <div className="brand-grid">
            {[
              { name: "Olympus", logo: "olympus.png" },
              { name: "SCHÖLLY", logo: "schoelly.svg" },
              { name: "Thermo Fisher Scientific", logo: "thermo-fisher.svg" },
            ].map((brand) => (
              <div className="brand-card" key={brand.name}>
                <Image
                  src={`/images/brands/${brand.logo}`}
                  alt={brand.name}
                  width={240}
                  height={110}
                  className="brand-logo"
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
