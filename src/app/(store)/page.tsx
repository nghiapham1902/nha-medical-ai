import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Headphones,
  FileCheck2,
  Check,
  Microscope,
  Wrench,
} from "lucide-react";
import "./home.css";
import { ContactForm } from "@/components/store";
import { CategoryTiles } from "@/components/category-tiles";
import { repository } from "@/lib/repository";
export const dynamic = "force-dynamic";

import { seo, jsonLd, siteUrl } from "@/lib/seo";
export const metadata = seo(
  "Giải pháp y tế & phòng thí nghiệm",
  "Thiết bị và vật tư phục vụ y tế, phòng thí nghiệm và khoa học. Khám phá giao diện demo NHA Medical.",
  "/",
);
export default async function Home() {
  const categories = await repository.getCategories();
  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NHA Medical",
            url: siteUrl,
            description:
              "Website giới thiệu demo thiết bị y tế và phòng thí nghiệm.",
          }),
        }}
      />
      <section className="medical-banner">
        <div className="container medical-banner-grid">
          <div className="medical-banner-copy">
            <span className="medical-banner-kicker">
              <span /> NHA MEDICAL · Y TẾ & KHOA HỌC
            </span>
            <h1>
              Kết nối công nghệ.
              <br />
              <span>Nâng tầm chăm sóc.</span>
            </h1>
            <p>
              Thiết bị y tế, phòng thí nghiệm và vật tư từ các hãng bạn tin
              chọn. Cùng NHA Medical tìm giải pháp phù hợp cho đơn vị của bạn.
            </p>
            <div className="medical-banner-actions">
              <Link href="/san-pham" className="button primary">
                Khám phá sản phẩm <ArrowRight size={18} />
              </Link>
              <a href="#tu-van" className="medical-banner-link">
                Yêu cầu tư vấn <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="medical-banner-bottom">
              <span>
                <Check size={16} /> Tư vấn theo nhu cầu
              </span>
              <span>
                <Check size={16} /> Giải pháp đồng bộ
              </span>
            </div>
          </div>
          <div className="medical-banner-visual">
            <Image
              src="/images/microscope-banner.jpg"
              alt="Cận cảnh vật kính hiển vi với ánh sáng xanh trong phòng thí nghiệm"
              style={{ objectPosition: "35% center" }}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <div className="medical-banner-caption">
              <span>ĐỒNG HÀNH CÙNG Y TẾ & KHOA HỌC</span>
              <strong>Giải pháp cho từng bước tiến.</strong>
              <small>Hình ảnh minh họa</small>
            </div>
            <div className="medical-banner-badge">
              <Microscope size={24} />
              <span>
                Thiết bị & giải pháp
                <br />
                <strong>Y tế · Phòng thí nghiệm</strong>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="giai-phap" className="container section landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DANH MỤC SẢN PHẨM</span>
            <h2>Tìm thiết bị theo nhu cầu</h2>
            <p>
              Từ vật tư sử dụng hằng ngày đến thiết bị cho phòng thí nghiệm.
            </p>
          </div>
          <Link href="/san-pham" className="text-link">
            Khám phá sản phẩm <ArrowRight size={17} />
          </Link>
        </div>
        <CategoryTiles categories={categories} />
      </section>
      <section
        id="thuong-hieu"
        className="container section landing-section supplied-brands"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">CÁC HÃNG CHÚNG TÔI CUNG CẤP</span>
            <h2>Thương hiệu bạn tin chọn</h2>
            <p>
              Kết nối nhu cầu của bạn với thiết bị từ Olympus, Thermo Fisher
              Scientific, Schölly, KARL STORZ, Stryker, GE HealthCare, Dräger,
              Mindray và nhiều hãng khác.
            </p>
          </div>
          <a href="#tu-van" className="text-link">
            Tư vấn theo hãng <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="supplied-brand-grid">
          {[
            { name: "Olympus", image: "/images/brands/olympus.png" },
            {
              name: "Thermo Fisher Scientific",
              image: "/images/brands/thermo-fisher.svg",
            },
            { name: "Schölly", image: "/images/brands/schoelly.svg" },
            { name: "KARL STORZ", image: "/images/brands/karl-storz.svg" },
            { name: "Stryker", image: "/images/brands/stryker.png" },
            {
              name: "GE HealthCare",
              image: "/images/brands/ge-healthcare.webp",
            },
            { name: "Dräger", image: "/images/brands/draeger.svg" },
            { name: "Mindray", image: "/images/brands/mindray.png" },
          ].map((brand) => (
            <a
              href="#tu-van"
              className="supplied-brand-card"
              key={brand.name}
              aria-label={"Tư vấn thiết bị " + brand.name}
            >
              <div
                className={`supplied-brand-logo${brand.name === "KARL STORZ" ? " supplied-brand-logo-storz" : ""}`}
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={200}
                  height={80}
                />
              </div>
              <span className="supplied-brand-label">
                {brand.name}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
        <p className="supplied-brand-note">
          Bạn đang tìm một hãng khác?{" "}
          <a href="#tu-van">
            Chia sẻ tên hãng và thiết bị cần tìm <ArrowRight size={14} />
          </a>
        </p>
      </section>
      <section id="dong-hanh" className="landing-benefits landing-section">
        <div className="container section landing-split">
          <div>
            <span className="eyebrow">ĐỒNG HÀNH CÙNG ĐƠN VỊ CỦA BẠN</span>
            <h2>
              Mỗi nhu cầu riêng.
              <br />
              Một giải pháp phù hợp.
            </h2>
            <p>
              Lựa chọn thiết bị bắt đầu từ việc hiểu cách bạn làm việc. NHA
              Medical hướng đến kết nối nhu cầu thực tế với phương án thiết bị
              và vật tư phù hợp.
            </p>
            <a href="#tu-van" className="button primary">
              Trao đổi cùng chúng tôi <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="landing-benefit-list">
            {[
              [
                Microscope,
                "Phù hợp chuyên môn",
                "Trao đổi về mục đích sử dụng, cấu hình và yêu cầu kỹ thuật của đơn vị.",
              ],
              [
                FileCheck2,
                "Rõ ràng từ đầu",
                "Cùng làm rõ danh mục, số lượng và thông tin cần có trong đề xuất báo giá.",
              ],
              [
                Headphones,
                "Kết nối xuyên suốt",
                "Trao đổi về cung ứng, bàn giao và nhu cầu hỗ trợ trong quá trình sử dụng.",
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Microscope;
              return (
                <article key={String(title)}>
                  <span className="landing-icon">
                    <I size={25} />
                  </span>
                  <div>
                    <h3>{String(title)}</h3>
                    <p>{String(description)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="quy-trinh" className="container section landing-section">
        <div className="landing-section-title">
          <span className="eyebrow">ĐƠN GIẢN TỪ BƯỚC ĐẦU TIÊN</span>
          <h2>Từ nhu cầu đến giải pháp</h2>
          <p>Ba bước để bắt đầu trao đổi cùng NHA Medical.</p>
        </div>
        <div className="landing-steps">
          {[
            [
              "01",
              "Chia sẻ nhu cầu",
              "Cho biết lĩnh vực hoạt động, thiết bị cần tìm và yêu cầu của đơn vị.",
            ],
            [
              "02",
              "Trao đổi phương án",
              "Làm rõ thông số, số lượng, ngân sách dự kiến và thời gian cần cung ứng.",
            ],
            [
              "03",
              "Thống nhất đề xuất",
              "Xem xét danh mục và báo giá trước khi thống nhất các bước tiếp theo.",
            ],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="bao-duong" className="home-maintenance landing-section">
        <div className="container home-maintenance-inner">
          <span className="landing-icon">
            <Wrench size={26} aria-hidden="true" />
          </span>
          <div>
            <span className="eyebrow">ĐỊNH HƯỚNG PHÁT TRIỂN</span>
            <h2>Bảo trì & bảo dưỡng thiết bị</h2>
            <p>
              NHA Medical định hướng phát triển dịch vụ chăm sóc thiết bị. Phạm
              vi và điều kiện dịch vụ sẽ được công bố khi có thông tin chính
              thức.
            </p>
          </div>
          <Link href="/lien-he?type=maintenance" className="text-link">
            Trao đổi nhu cầu
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="container section landing-faq">
        <div>
          <span className="eyebrow">THÔNG TIN HỮU ÍCH</span>
          <h2>Bạn đang băn khoăn?</h2>
          <p>Một vài thông tin trước khi bắt đầu.</p>
        </div>
        <div>
          {[
            [
              "Chưa biết chọn thiết bị nào, tôi có thể trao đổi không?",
              "Bạn có thể mô tả mục đích sử dụng, lĩnh vực chuyên môn và ngân sách dự kiến trong biểu mẫu để làm cơ sở trao đổi phương án phù hợp.",
            ],
            [
              "Cần chuẩn bị gì khi yêu cầu báo giá?",
              "Hãy cung cấp tên thiết bị hoặc vật tư, số lượng, thông số mong muốn và thời gian dự kiến trong phần nội dung yêu cầu.",
            ],
            [
              "Tôi có thể xem danh mục sản phẩm ở đâu?",
              "Chọn Khám phá sản phẩm ở phần giải pháp để xem danh mục và thông tin minh họa của từng sản phẩm.",
            ],
            [
              "Biểu mẫu đã gửi đến NHA Medical chưa?",
              "Website hiện là bản demo. Yêu cầu chỉ được lưu trên trình duyệt bạn đang sử dụng, chưa gửi email hoặc chuyển đến NHA Medical.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="tu-van" className="landing-contact landing-section">
        <div className="container section landing-split">
          <div className="landing-contact-copy">
            <span className="eyebrow">BẮT ĐẦU KẾT NỐI</span>
            <h2>
              Giải pháp tốt bắt đầu
              <br />
              từ sự thấu hiểu.
            </h2>
            <p>
              Chia sẻ nhu cầu của bạn để bắt đầu xây dựng danh mục thiết bị và
              vật tư phù hợp cho đơn vị.
            </p>
            <div className="landing-contact-note">
              <ShieldCheck size={24} />
              <span>
                Thông tin càng cụ thể, việc trao đổi phương án càng thuận tiện.
              </span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
