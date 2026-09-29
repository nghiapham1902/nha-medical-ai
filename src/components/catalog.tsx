"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, Search, ArrowRight } from "lucide-react";
import type { Category, CatalogProduct } from "@/lib/catalog";
function brandLabel(value: string) {
  return value.normalize("NFC").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().replace(/\s+/g, " ");
}
function brandKey(value: string) {
  return brandLabel(value).toLocaleLowerCase("vi");
}
export function Catalog({
  products,
  categories,
  selected = "",
  initialQuery = "",
}: {
  products: CatalogProduct[];
  categories: Category[];
  selected?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const brands = useMemo(
    () => {
      const unique = new Map<string, string>();
      for (const product of products) {
        const label = brandLabel(product.brand);
        const key = brandKey(label);
        if (key && !unique.has(key)) unique.set(key, label);
      }
      return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1], "vi"));
    },
    [products],
  );
  const filtered = products
    .filter(
      (p) =>
        (!brand || brandKey(p.brand) === brand) &&
        `${p.name} ${p.sku} ${p.model}`
          .toLocaleLowerCase("vi")
          .includes(query.toLocaleLowerCase("vi")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "vi")
        : b.created_at.localeCompare(a.created_at),
    );
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 6)),
  );
  return (
    <div className="catalog-layout">
      <aside className="filters">
        <h3>Bộ lọc sản phẩm</h3>
        <label>
          Danh mục
          <select
            value={selected}
            onChange={(e) =>
              router.push(
                e.target.value ? `/danh-muc/${e.target.value}` : "/san-pham",
              )
            }
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {!!brands.length && (
          <label>
            Thương hiệu
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
        )}
        <button
          className="text-button"
          onClick={() => {
            setQuery("");
            setBrand("");
            setPage(1);
            if (selected) router.push("/san-pham");
          }}
        >
          Xóa bộ lọc
        </button>
        <div className="filter-help">
          <h3>Cần hỗ trợ lựa chọn?</h3>
          <p>Gửi nhu cầu để trao đổi về thiết bị phù hợp.</p>
          <Link href="/lien-he">Liên hệ tư vấn →</Link>
        </div>
      </aside>
      <div>
        <div className="catalog-toolbar">
          <div className="input-icon">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm sản phẩm, SKU hoặc model…"
              aria-label="Tìm sản phẩm"
            />
          </div>
          <select
            aria-label="Sắp xếp"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="new">Mới nhất</option>
            <option value="name">Tên A–Z</option>
          </select>
        </div>
        <p className="result-count">{filtered.length} sản phẩm</p>
        {filtered.length ? (
          <div className="product-grid catalog-products">
            {filtered.slice((currentPage - 1) * 6, currentPage * 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={36} />
            <h3>Chưa có sản phẩm phù hợp</h3>
            <p>Thử từ khóa khác hoặc liên hệ để được tư vấn.</p>
          </div>
        )}
        <div className="pagination">
          {Array.from({ length: Math.ceil(filtered.length / 6) }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              aria-label={`Trang ${i + 1}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function ProductCard({ product: p }: { product: CatalogProduct }) {
  const [failed, setFailed] = useState(false);
  const image = p.image || p.media?.find((m) => m.type === "image")?.src;
  return (
    <article className="product-card catalog-product-card">
      <Link href={`/san-pham/${p.slug}`} className="product-image">
        {image && !failed ? (
          <Image
            src={image}
            alt={p.name}
            fill
            unoptimized
            sizes="(max-width:640px) 100vw, 33vw"
            style={{ objectFit: "contain" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="catalog-image-empty">
            <ImageOff size={32} />
            <span>Chưa có ảnh sản phẩm</span>
          </span>
        )}
      </Link>
      <div className="product-info">
        <span className="product-category" title={p.category}>{p.category}</span>
        <Link href={`/san-pham/${p.slug}`}>
          <h3 title={p.name}>{p.name}</h3>
        </Link>
        <div className="product-code">
          <div><span>SKU</span><span title={p.sku}>{p.sku}</span></div>
          {p.model && <div><span>Model</span><span title={p.model}>{p.model}</span></div>}
        </div>
        <div className="product-price">
          <Link
            className="button primary product-quote"
            href={`/lien-he?type=quote&product=${encodeURIComponent(p.name)}`}
          >
            Nhận báo giá
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
