/** @jsxImportSource react */
import { FileText, ArrowRight } from "lucide-react";
import type { ProductRecord } from "@/lib/catalog";
import { ARTICLE_PREFIX } from "@/lib/article-format";
import { cleanArticle } from "@/lib/article-html";
export function ProductInformation({ product: p }: { product: ProductRecord }) {
  const details = {
    introduction: p.introduction,
    highlights: p.application_items,
    documents: p.documents,
  };
  const specifications = p.specifications;
  return (
    <div className="pdp-sections">
      {!!details.introduction && (
        <section id="gioi-thieu">
          <span className="eyebrow">TỔNG QUAN</span>
          <h2>Giới thiệu sản phẩm</h2>
          {details.introduction.startsWith(ARTICLE_PREFIX) ? (
            <div className="article-body" dangerouslySetInnerHTML={{ __html: cleanArticle(details.introduction.slice(ARTICLE_PREFIX.length)) }} />
          ) : <p className="catalog-prose">{details.introduction}</p>}
        </section>
      )}
      {!!(details.highlights.length || p.applications) && (
        <section id="ung-dung">
          <h2>Ứng dụng & lựa chọn</h2>
          {p.applications && <p className="catalog-prose">{p.applications}</p>}
          {!!details.highlights.length && (
            <ul className="pdp-use-list">
              {details.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}
      {!!specifications.length && (
        <section id="thong-so">
          <h2>Thông số kỹ thuật</h2>
          <table className="pdp-specs">
            <caption>Thông số của {p.name}</caption>
            <tbody>
              {specifications.map((spec, index) => (
                <tr key={index}>
                  <th scope="row">
                    {spec.group && (
                      <small className="spec-group">{spec.group}</small>
                    )}
                    {spec.name}
                  </th>
                  <td>
                    {spec.value}
                    {spec.unit ? ` ${spec.unit}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {!!details?.documents?.length && (
        <section id="tai-lieu">
          <h2>Tài liệu sản phẩm</h2>
          <div className="pdp-documents">
            {details.documents.map((document) => (
              <a className="text-link" key={document.href} href={document.href}>
                <FileText size={20} aria-hidden="true" />
                {document.name}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
