import {
  Package,
  FileText,
  ListChecks,
  Images,
  Files,
  ImagePlus,
  Video,
  Plus,
  ArrowUp,
  ArrowDown,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { Category, ProductInput } from "@/lib/catalog";
import { ProductImagePreview } from "./product-image-preview";
import { videoSource } from "@/lib/video-source";

function videoPreviewImage(src: string, poster?: string) {
  if (poster?.trim()) return poster;
  const video = videoSource(src);
  if (video?.kind !== "embed") return "";
  const url = new URL(video.src);
  return url.hostname === "www.youtube.com"
    ? `https://i.ytimg.com/vi/${url.pathname.split("/").pop()}/hqdefault.jpg`
    : "";
}
function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="product-section-heading">
      <span>
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
export function ProductEditor({
  product,
  setProduct,
  categories,
}: {
  product: ProductInput;
  setProduct: (value: ProductInput) => void;
  categories: Category[];
}) {
  function field(
    key: keyof ProductInput,
    label: string,
    required = false,
    long = false,
    max = 200,
  ) {
    const props = {
      value: String(product[key]),
      required,
      maxLength: max,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setProduct({ ...product, [key]: e.target.value }),
    };
    return (
      <label>
        {label}
        {required ? " *" : ""}
        {long ? <textarea {...props} rows={4} /> : <input {...props} />}
      </label>
    );
  }
  return (
    <>
      <nav
        className="product-section-nav"
        aria-label="Các phần thông tin sản phẩm"
      >
        <a href="#product-basic">
          <Package size={16} />
          Thông tin
        </a>
        <a href="#product-content">
          <FileText size={16} />
          Nội dung
        </a>
        <a href="#product-specifications">
          <ListChecks size={16} />
          Thông số
        </a>
        <a href="#product-media">
          <Images size={16} />
          Ảnh & video
        </a>
        <a href="#product-documents">
          <Files size={16} />
          Tài liệu
        </a>
      </nav>
      <div className="product-editor-layout">
        <div className="product-editor-main">
          <section className="product-form-card" id="product-basic">
            <SectionTitle
              icon={Package}
              title="Thông tin cơ bản"
              description="Nhập thông tin nhận diện và phân loại sản phẩm. Các trường có dấu * là bắt buộc."
            />
            <div className="form-grid">
              {field("name", "Tên sản phẩm", true)}
              {field("slug", "Slug", true, false, 160)}
              {field("sku", "SKU", true, false, 80)}
              {field("model", "Model")}
              {field("brand", "Thương hiệu")}
              <label>
                Danh mục chính *
                <select
                  required
                  value={product.category_id}
                  onChange={(e) =>
                    setProduct({ ...product, category_id: e.target.value })
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {!c.active ? " (Ẩn)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {field("description", "Mô tả ngắn", false, true, 1000)}
          </section>
          <section className="product-form-card" id="product-content">
            <SectionTitle
              icon={FileText}
              title="Nội dung chi tiết"
              description="Giới thiệu sản phẩm và hướng dẫn lựa chọn cho khách hàng."
            />
            <p>
              Giới thiệu đặc điểm, công dụng và những lưu ý khi lựa chọn sản
              phẩm. Có thể để trống phần chưa có thông tin.
            </p>
            {field("introduction", "Giới thiệu", false, true, 20000)}
            {field(
              "applications",
              "Ứng dụng & lựa chọn — đoạn văn",
              false,
              true,
              20000,
            )}
            <label>
              Ứng dụng & lựa chọn — danh sách (mỗi dòng một ý)
              <textarea
                rows={4}
                value={product.application_items.join("\n")}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    application_items: e.target.value.split("\n"),
                  })
                }
              />
            </label>
          </section>
          <section className="product-form-card" id="product-specifications">
            <SectionTitle
              icon={ListChecks}
              title="Thông số kỹ thuật"
              description="Bổ sung các thông số để khách hàng dễ đối chiếu."
            />
            {!product.specifications.length && (
              <div className="product-form-empty">
                <ListChecks size={26} aria-hidden="true" />
                <span>Chưa có thông số kỹ thuật</span>
                <small>Thêm tên, giá trị và đơn vị cho từng thông số.</small>
              </div>
            )}
            <p>Thứ tự dòng bên dưới là thứ tự hiển thị trên website.</p>
            {product.specifications.map((spec, i) => (
              <div className="admin-repeat" key={i}>
                <div className="form-grid">
                  {(
                    [
                      ["name", "Tên thông số"],
                      ["value", "Giá trị"],
                      ["unit", "Đơn vị"],
                      ["group", "Nhóm thông số"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <input
                        required={key === "name" || key === "value"}
                        maxLength={
                          key === "value" ? 2000 : key === "unit" ? 80 : 200
                        }
                        value={spec[key]}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            specifications: product.specifications.map(
                              (s, j) =>
                                j === i ? { ...s, [key]: e.target.value } : s,
                            ),
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="button secondary"
                    disabled={i === 0}
                    aria-label={`Đưa thông số ${i + 1} lên`}
                    onClick={() => {
                      const specs = [...product.specifications];
                      [specs[i - 1], specs[i]] = [specs[i], specs[i - 1]];
                      setProduct({ ...product, specifications: specs });
                    }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    disabled={i === product.specifications.length - 1}
                    aria-label={`Đưa thông số ${i + 1} xuống`}
                    onClick={() => {
                      const specs = [...product.specifications];
                      [specs[i + 1], specs[i]] = [specs[i], specs[i + 1]];
                      setProduct({ ...product, specifications: specs });
                    }}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() =>
                      setProduct({
                        ...product,
                        specifications: product.specifications.filter(
                          (_, j) => i !== j,
                        ),
                      })
                    }
                  >
                    Xóa dòng {i + 1}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="button secondary"
              disabled={product.specifications.length >= 200}
              onClick={() =>
                setProduct({
                  ...product,
                  specifications: [
                    ...product.specifications,
                    { name: "", value: "", unit: "", group: "" },
                  ],
                })
              }
            >
              <Plus size={17} />
              Thêm thông số
            </button>
          </section>
          <section className="product-form-card" id="product-media">
            <SectionTitle
              icon={Images}
              title="Hình ảnh & video"
              description="Thêm ảnh chính và nội dung minh họa sản phẩm."
            />
            <p>
              Dùng URL HTTPS hoặc đường dẫn tài nguyên hiện có. Chỉ dùng ảnh
              đúng sản phẩm/model; video có thể là file trực tiếp (.mp4) hoặc
              liên kết YouTube/Vimeo để xem trực tiếp trong trang chi tiết.
            </p>
            {field("image", "URL ảnh chính", false, false, 2048)}
            <ProductImagePreview
              src={product.image}
              label="Xem trước ảnh chính"
            />
            {product.media.map((item, i) => (
              <div className="admin-repeat" key={i}>
                <strong>
                  Nội dung {i + 1} · {item.type === "image" ? "Ảnh" : "Video"}
                </strong>
                <label>
                  URL *
                  <input
                    required
                    maxLength={2048}
                    value={item.src}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        media: product.media.map((m, j) =>
                          i === j ? { ...m, src: e.target.value } : m,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  {item.type === "image" ? "Mô tả ảnh" : "Tên video"} *
                  <input
                    required
                    maxLength={300}
                    value={item.type === "image" ? item.alt : item.title}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        media: product.media.map((m, j) =>
                          i === j
                            ? m.type === "image"
                              ? { ...m, alt: e.target.value }
                              : { ...m, title: e.target.value }
                            : m,
                        ),
                      })
                    }
                  />
                </label>
                {item.type === "video" && (
                  <label>
                    URL ảnh poster
                    <input
                      value={item.poster || ""}
                      maxLength={2048}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          media: product.media.map((m, j) =>
                            i === j && m.type === "video"
                              ? { ...m, poster: e.target.value }
                              : m,
                          ),
                        })
                      }
                    />
                  </label>
                )}
                <ProductImagePreview
                  src={
                    item.type === "image"
                      ? item.src
                      : videoPreviewImage(item.src, item.poster)
                  }
                  label={
                    item.type === "image"
                      ? `Xem trước ảnh ${i + 1}`
                      : `Ảnh đại diện video ${i + 1}`
                  }
                  emptyText={
                    item.type === "video"
                      ? "Nhập URL ảnh poster hoặc liên kết YouTube để xem trước"
                      : undefined
                  }
                />
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    setProduct({
                      ...product,
                      media: product.media.filter((_, j) => i !== j),
                    })
                  }
                >
                  Xóa nội dung {i + 1}
                </button>
              </div>
            ))}
            <div className="admin-row-actions">
              <button
                type="button"
                className="button secondary"
                disabled={product.media.length >= 50}
                onClick={() =>
                  setProduct({
                    ...product,
                    media: [
                      ...product.media,
                      { type: "image", src: "", alt: "" },
                    ],
                  })
                }
              >
                <ImagePlus size={17} aria-hidden="true" />
                Thêm ảnh
              </button>
              <button
                type="button"
                className="button secondary"
                disabled={product.media.length >= 50}
                onClick={() =>
                  setProduct({
                    ...product,
                    media: [
                      ...product.media,
                      { type: "video", src: "", title: "" },
                    ],
                  })
                }
              >
                <Video size={17} aria-hidden="true" />
                Thêm video
              </button>
            </div>
          </section>
          <section className="product-form-card" id="product-documents">
            <SectionTitle
              icon={Files}
              title="Tài liệu sản phẩm"
              description="Đính kèm catalogue, hướng dẫn sử dụng hoặc tài liệu kỹ thuật bằng đường dẫn."
            />
            {!product.documents.length && (
              <div className="product-form-empty">
                <Files size={26} aria-hidden="true" />
                <span>Chưa có tài liệu đính kèm</span>
              </div>
            )}
            {product.documents.map((doc, i) => (
              <div className="admin-repeat" key={i}>
                <label>
                  Tên tài liệu *
                  <input
                    required
                    maxLength={200}
                    value={doc.name}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        documents: product.documents.map((d, j) =>
                          i === j ? { ...d, name: e.target.value } : d,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  URL tài liệu *
                  <input
                    required
                    maxLength={2048}
                    value={doc.href}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        documents: product.documents.map((d, j) =>
                          i === j ? { ...d, href: e.target.value } : d,
                        ),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    setProduct({
                      ...product,
                      documents: product.documents.filter((_, j) => i !== j),
                    })
                  }
                >
                  Xóa tài liệu {i + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button secondary"
              disabled={product.documents.length >= 50}
              onClick={() =>
                setProduct({
                  ...product,
                  documents: [...product.documents, { name: "", href: "" }],
                })
              }
            >
              <Plus size={17} aria-hidden="true" />
              Thêm tài liệu
            </button>
          </section>
        </div>
        <aside className="product-editor-aside">
          <section className="product-form-card">
            <SectionTitle
              icon={Send}
              title="Xuất bản"
              description="Chọn trạng thái hiển thị của sản phẩm."
            />{" "}
            <label className="admin-status">
              Trạng thái xuất bản
              <select
                value={product.status}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    status: e.target.value as ProductInput["status"],
                  })
                }
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </label>
            {product.category_id &&
              !categories.find((c) => c.id === product.category_id)?.active && (
                <p>
                  Danh mục đang ẩn. Sản phẩm sẽ chưa hiển thị công khai dù đã
                  xuất bản.
                </p>
              )}
            <div className="product-publish-note">
              {product.status === "draft"
                ? "Bản nháp chỉ hiển thị trong trang quản trị."
                : "Sản phẩm sẽ hiển thị trên website khi danh mục đang hiển thị."}
            </div>
          </section>
          <section className="product-form-card product-summary">
            <span className="product-summary-label">TÓM TẮT SẢN PHẨM</span>
            <ProductImagePreview
              src={
                product.image ||
                product.media.find((item) => item.type === "image")?.src
              }
              label="Ảnh sản phẩm"
              emptyText="Chưa có ảnh sản phẩm"
            />
            <h3>{product.name.trim() || "Tên sản phẩm"}</h3>
            <p>
              {categories.find((c) => c.id === product.category_id)?.name ||
                "Chưa chọn danh mục"}
            </p>
            <dl>
              <div>
                <dt>SKU</dt>
                <dd>{product.sku || "Chưa nhập"}</dd>
              </div>
              <div>
                <dt>Thương hiệu</dt>
                <dd>{product.brand || "Chưa nhập"}</dd>
              </div>
              <div>
                <dt>Thông số</dt>
                <dd>{product.specifications.length}</dd>
              </div>
              <div>
                <dt>Ảnh & video</dt>
                <dd>{product.media.length + (product.image ? 1 : 0)}</dd>
              </div>
              <div>
                <dt>Tài liệu</dt>
                <dd>{product.documents.length}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </>
  );
}
