import { ProductInformation } from "@/components/product-information";
import { ProductGallery } from "@/components/product-gallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { repository } from "@/lib/repository";
import { seo, jsonLd } from "@/lib/seo";
import "./product-detail.css";

export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await repository.getProduct((await params).slug);
  return p
    ? seo(p.name, p.description, `/san-pham/${p.slug}`)
    : { title: "Không tìm thấy sản phẩm" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await repository.getProduct((await params).slug);
  if (!p) notFound();
  const details = {
    introduction: p.introduction,
    highlights: p.application_items,
    documents: p.documents,
  };
  const contact = `/lien-he?product=${encodeURIComponent(p.name)}`;
  const quote = `${contact}&type=quote`;
  const specifications = p.specifications;
  const sections = [
    {
      id: "gioi-thieu",
      label: "Giới thiệu",
      show: !!details.introduction,
    },
    {
      id: "ung-dung",
      label: "Ứng dụng & lựa chọn",
      show: !!(details.highlights.length || p.applications),
    },
    {
      id: "thong-so",
      label: "Thông số kỹ thuật",
      show: !!specifications.length,
    },
    { id: "tai-lieu", label: "Tài liệu", show: !!details?.documents?.length },
  ].filter((section) => section.show);
  const related = (await repository.getProducts(p.category_id))
    .filter((item) => item.id !== p.id && item.category === p.category)
    .slice(0, 3);
  return (
    <div className="pdp container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            sku: p.sku,
            model: p.model || undefined,
            brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
            description: p.description,
            image: p.media
              ?.filter((item) => item.type === "image")
              .map((item) => item.src),
          }),
        }}
      />
      <nav className="pdp-breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/san-pham">Sản phẩm</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </nav>
      <div className="pdp-hero">
        <div className="pdp-summary">
          <Link className="eyebrow" href={`/danh-muc/${p.categorySlug}`}>
            {p.category}
          </Link>
          <h1>{p.name}</h1>
          <div className="pdp-identity">
            <span>
              Mã sản phẩm <strong>{p.sku}</strong>
            </span>
            {p.model && (
              <span>
                Model <strong>{p.model}</strong>
              </span>
            )}
            {p.brand && p.brand !== "Chưa xác định" && (
              <span>
                Thương hiệu <strong>{p.brand}</strong>
              </span>
            )}
          </div>
          {p.description && <p className="pdp-description">{p.description}</p>}
          {!!details?.highlights.length && (
            <ul className="pdp-highlights">
              {details.highlights.slice(0, 3).map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="pdp-inquiry">
            <p>
              Trao đổi nhu cầu, cấu hình và số lượng để nhận tư vấn phù hợp.
            </p>
            <div className="pdp-actions">
              <Link className="button primary" href={contact}>
                <MessageCircle size={18} aria-hidden="true" />
                Yêu cầu tư vấn
              </Link>
              <Link className="button secondary" href={quote}>
                Nhận báo giá
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <ProductGallery key={p.id} name={p.name} media={p.media} />
      </div>
      <nav className="pdp-section-nav" aria-label="Thông tin sản phẩm">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>
      <div className="pdp-content">
        <ProductInformation product={p} />
        <aside className="pdp-help">
          <MessageCircle size={26} aria-hidden="true" />
          <h2>Cần thêm thông tin?</h2>
          <p>
            Gửi nhu cầu sử dụng và thông tin bạn cần làm rõ để trao đổi về sản
            phẩm này.
          </p>
          <Link className="button primary" href={contact}>
            Yêu cầu tư vấn
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Biểu mẫu hiện là bản demo, chỉ lưu trên trình duyệt.</small>
        </aside>
      </div>
      {!!related.length && (
        <section className="pdp-related">
          <div className="section-heading">
            <h2>Cùng danh mục</h2>
            <Link className="text-link" href={`/danh-muc/${p.categorySlug}`}>
              Xem danh mục
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="pdp-related-grid">
            {related.map((item) => (
              <Link key={item.id} href={`/san-pham/${item.slug}`}>
                <span>{item.sku}</span>
                <h3>{item.name}</h3>
                <span className="text-link">
                  Xem chi tiết
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="pdp-mobile-contact">
        <span>
          <small>Tư vấn sản phẩm</small>
          <strong>{p.name}</strong>
        </span>
        <Link className="button primary" href={quote}>
          Nhận báo giá
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
