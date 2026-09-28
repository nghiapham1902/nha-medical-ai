"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Tags,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  Layers3,
} from "lucide-react";
import { Logo } from "./store";
import {
  type Category,
  type CategoryInput,
  type ProductInput,
  type ProductRecord,
} from "@/lib/catalog";
import "./catalog-admin.css";
import { AdminNotice } from "./admin-notice";
import { ProductEditor } from "./product-editor";
import { CategoryEditor, CategoryIcon } from "./category-editor";

type Resource = "categories" | "products";
type Entry = Category | ProductRecord;
const emptyCategory: CategoryInput = {
  name: "",
  slug: "",
  description: "",
  icon: "Package",
  sort_order: 0,
  active: true,
};
const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  sku: "",
  model: "",
  brand: "",
  category_id: "",
  description: "",
  image: "",
  media: [],
  documents: [],
  status: "draft",
  introduction: "",
  applications: "",
  application_items: [],
  specifications: [],
};
async function api(resource: Resource, method = "GET", body?: unknown) {
  const response = await fetch(`/api/admin/${resource}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => {
    throw new Error("Máy chủ chưa phản hồi đúng. Vui lòng thử lại.");
  });
  if (!response.ok)
    throw new Error(result.error || "Không thể thực hiện thao tác.");
  return result;
}
export function Dashboard() {
  const [tab, setTab] = useState<Resource>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [editing, setEditing] = useState<{
    resource: Resource;
    entry?: Entry;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [c, p] = await Promise.all([api("categories"), api("products")]);
      setCategories(c.data);
      setProducts(p.data);
      setReady(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);
  const rows = (tab === "categories" ? categories : products).filter((r) =>
    `${r.name} ${r.slug} ${"sku" in r ? r.sku : ""}`
      .toLocaleLowerCase("vi")
      .includes(query.toLocaleLowerCase("vi")),
  );
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      await api(tab, "DELETE", {
        id: deleting.id,
        updated_at: deleting.updated_at,
      });
      setDeleting(null);
      setStatus(
        tab === "categories"
          ? "Đã xóa danh mục thành công."
          : "Đã xóa sản phẩm thành công.",
      );
      try {
        await load();
      } catch {
        setStatus("");
        setError(
          "Đã xóa thành công nhưng chưa tải lại được danh sách. Hãy nhấn Tải lại để cập nhật.",
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? `Không thể xóa ${tab === "categories" ? "danh mục" : "sản phẩm"}: ${e.message}`
          : `Không thể xóa ${tab === "categories" ? "danh mục" : "sản phẩm"}.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="dashboard-shell catalog-admin">
      <aside className="dashboard-sidebar">
        <div className="catalog-sidebar-brand">
          <Logo />
        </div>
        <span className="sidebar-label">QUẢN LÝ NỘI DUNG</span>
        <nav aria-label="Điều hướng quản trị">
          {(
            [
              ["products", "Sản phẩm", Package],
              ["categories", "Danh mục", Tags],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              disabled={busy || saving || loading}
              className={tab === key ? "selected" : ""}
              aria-current={tab === key ? "page" : undefined}
              onClick={() => {
                setTab(key);
                setEditing(null);
                setDeleting(null);
                setQuery("");
                setError("");
                setStatus("");
              }}
            >
              <span className="catalog-nav-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="catalog-nav-text">
                <strong>{label}</strong>
                <span>
                  {key === "products"
                    ? "Nội dung & hình ảnh"
                    : "Phân nhóm sản phẩm"}
                </span>
              </span>
              <ChevronRight
                className="catalog-nav-arrow"
                size={15}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="catalog-sidebar-summary">
            <span className="catalog-summary-icon">
              <Layers3 size={20} aria-hidden="true" />
            </span>
            <strong>Catalogue của bạn</strong>
            <p>
              {ready
                ? `${products.length} sản phẩm · ${categories.length} danh mục`
                : loading
                  ? "Đang tải nội dung…"
                  : "Chưa tải được nội dung"}
            </p>
          </div>
          <Link href="/">
            Về website <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </aside>
      <main className="dashboard-body">
        <header className="dashboard-header">
          <strong>Quản trị nội dung</strong>
          <button
            className="button secondary"
            disabled={busy || saving}
            onClick={async () => {
              try {
                const r = await fetch("/api/auth/logout", { method: "POST" });
                if (!r.ok) throw new Error();
                window.location.assign("/dang-nhap");
              } catch {
                setError("Không thể đăng xuất. Vui lòng thử lại.");
              }
            }}
          >
            <LogOut size={17} />
            Đăng xuất
          </button>
        </header>
        <div className="admin-content">
          <div className="section-heading">
            <div>
              <h1>{tab === "categories" ? "Danh mục" : "Sản phẩm"}</h1>
              <p>
                {tab === "categories"
                  ? "Sắp xếp và quản lý nhóm sản phẩm."
                  : "Chỉ nội dung đã xuất bản trong danh mục hiển thị mới xuất hiện trên website."}
              </p>
            </div>
            {!editing && (
              <button
                disabled={!ready || busy || loading}
                className="button primary"
                onClick={() => {
                  setEditing({ resource: tab });
                  setError("");
                  setStatus("");
                }}
              >
                <Plus size={18} />
                Thêm mới
              </button>
            )}
          </div>
          <div className="admin-notices">
            <AdminNotice
              kind="error"
              message={error}
              onClose={() => setError("")}
            />
            <AdminNotice
              kind="success"
              message={status}
              onClose={() => setStatus("")}
            />
          </div>
          {editing ? (
            <Editor
              key={editing.entry?.id || editing.resource}
              resource={editing.resource}
              entry={editing.entry}
              categories={categories}
              onBusyChange={setSaving}
              onError={setError}
              onCancel={() => setEditing(null)}
              onSaved={async (name) => {
                setEditing(null);
                setStatus(
                  `Đã lưu ${editing.entry ? "thay đổi" : "mới"} ${editing.resource === "categories" ? "danh mục" : "sản phẩm"} “${name}”.`,
                );
                try {
                  await load();
                } catch {
                  setStatus("");
                  setError(
                    "Dữ liệu đã lưu thành công nhưng chưa tải lại được danh sách. Hãy nhấn Tải lại để cập nhật.",
                  );
                }
              }}
            />
          ) : (
            <>
              <div className="admin-toolbar">
                <input
                  aria-label="Tìm dữ liệu"
                  placeholder="Tìm theo tên, slug hoặc SKU…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  className="button secondary"
                  disabled={loading || busy}
                  onClick={() => {
                    setStatus("");
                    load().catch((e) => setError(e.message));
                  }}
                >
                  {loading ? "Đang tải…" : "Tải lại"}
                </button>
              </div>
              {!ready ? (
                <p>
                  {loading
                    ? "Đang tải dữ liệu…"
                    : "Chưa tải được dữ liệu. Nhấn Tải lại để thử lại."}
                </p>
              ) : (
                <div className="admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tên / Slug</th>
                        <th>
                          {tab === "categories" ? "Thứ tự" : "SKU / Danh mục"}
                        </th>
                        <th>Trạng thái</th>
                        <th>Cập nhật</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <strong className="admin-entry-name">
                              {"icon" in row && (
                                <span className="admin-category-icon">
                                  <CategoryIcon name={row.icon} size={20} />
                                </span>
                              )}
                              {row.name}
                            </strong>
                            <small>{row.slug}</small>
                          </td>
                          <td>
                            {"sku" in row ? (
                              <>
                                <span className="admin-sku">{row.sku}</span>
                                <small className="admin-category-label">
                                  {
                                    categories.find(
                                      (c) => c.id === row.category_id,
                                    )?.name
                                  }
                                </small>
                              </>
                            ) : (
                              <span className="admin-order-label">
                                {row.sort_order}
                              </span>
                            )}
                          </td>
                          <td>
                            {"active" in row ? (
                              <span
                                className={`admin-status-badge ${row.active ? "is-published" : "is-hidden"}`}
                              >
                                {row.active ? "Hiển thị" : "Ẩn"}
                              </span>
                            ) : (
                              <>
                                <span
                                  className={`admin-status-badge ${row.status === "published" ? "is-published" : "is-draft"}`}
                                >
                                  {row.status === "published"
                                    ? "Đã xuất bản"
                                    : "Nháp"}
                                </span>
                                {!categories.find(
                                  (c) => c.id === row.category_id,
                                )?.active && (
                                  <small className="admin-category-warning">
                                    Danh mục đang ẩn
                                  </small>
                                )}
                              </>
                            )}
                          </td>
                          <td className="admin-updated-at">
                            {new Date(row.updated_at).toLocaleString("vi-VN")}
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                className="icon-button admin-action-edit"
                                disabled={busy || loading}
                                aria-label={`Sửa ${row.name}`}
                                onClick={() => {
                                  setError("");
                                  setStatus("");
                                  setDeleting(null);
                                  setEditing({ resource: tab, entry: row });
                                }}
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                className="icon-button admin-action-delete"
                                disabled={busy || loading}
                                aria-label={`Xóa ${row.name}`}
                                onClick={() => {
                                  setDeleting(row);
                                  setStatus("");
                                  setError("");
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!rows.length && (
                    <p className="empty-state">Chưa có dữ liệu phù hợp.</p>
                  )}
                </div>
              )}
              {deleting && (
                <section className="admin-delete" aria-label="Xác nhận xóa">
                  <h2>Xóa “{deleting.name}”?</h2>
                  <p>
                    {tab === "categories"
                      ? "Không thể xóa danh mục còn sản phẩm. Hãy chuyển sản phẩm sang danh mục khác hoặc sửa trạng thái danh mục thành Ẩn."
                      : "Sản phẩm sẽ bị xóa khỏi catalogue. Bạn có thể chuyển về Nháp nếu muốn giữ nội dung."}
                  </p>
                  <button
                    disabled={busy}
                    className="button secondary"
                    onClick={() => setDeleting(null)}
                  >
                    Hủy
                  </button>{" "}
                  <button
                    disabled={busy}
                    className="button primary"
                    onClick={remove}
                  >
                    {busy ? "Đang xóa…" : "Xóa bản ghi"}
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function Editor({
  resource,
  entry,
  categories,
  onCancel,
  onSaved,
  onBusyChange,
  onError,
}: {
  resource: Resource;
  entry?: Entry;
  categories: Category[];
  onCancel: () => void;
  onSaved: (name: string) => Promise<void>;
  onError: (message: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [category, setCategory] = useState<CategoryInput>(
    resource === "categories" && entry
      ? (entry as Category)
      : { ...emptyCategory },
  );
  const [product, setProduct] = useState<ProductInput>(
    resource === "products" && entry
      ? (entry as ProductRecord)
      : { ...emptyProduct },
  );
  const [busy, setBusy] = useState(false);
  return (
    <form
      className={`admin-editor ${resource === "products" ? "product-admin-editor" : ""}`}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        onBusyChange(true);
        onError("");
        try {
          await api(resource, entry ? "PUT" : "POST", {
            ...(resource === "categories"
              ? category
              : {
                  ...product,
                  application_items: product.application_items
                    .map((item) => item.trim())
                    .filter(Boolean),
                }),
            ...(entry ? { id: entry.id, updated_at: entry.updated_at } : {}),
          });
          await onSaved(
            resource === "categories" ? category.name : product.name,
          );
        } catch (e) {
          onError(
            e instanceof Error
              ? `Không thể lưu ${resource === "categories" ? "danh mục" : "sản phẩm"}: ${e.message}`
              : `Không thể lưu ${resource === "categories" ? "danh mục" : "sản phẩm"}.`,
          );
        } finally {
          setBusy(false);
          onBusyChange(false);
        }
      }}
    >
      <fieldset disabled={busy}>
        <legend>
          {entry ? "Chỉnh sửa" : "Tạo mới"}{" "}
          {resource === "categories" ? "danh mục" : "sản phẩm"}
        </legend>
        {resource === "categories" ? (
          <CategoryEditor category={category} onChange={setCategory} />
        ) : (
          <ProductEditor
            product={product}
            setProduct={setProduct}
            categories={categories}
          />
        )}
        {entry && (
          <p>
            Tạo: {new Date(entry.created_at).toLocaleString("vi-VN")} · Cập
            nhật: {new Date(entry.updated_at).toLocaleString("vi-VN")}
          </p>
        )}
        <div className="admin-save">
          <button type="submit" className="button primary">
            {busy ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
          <button type="button" className="button secondary" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </fieldset>
    </form>
  );
}
