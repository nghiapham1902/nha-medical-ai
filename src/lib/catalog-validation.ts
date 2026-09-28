import { iconNames, type CategoryInput, type ProductInput } from "./catalog";
export class ValidationError extends Error {}
function invalid(message: string): never {
  throw new ValidationError(message);
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    invalid("Dữ liệu phải là một đối tượng.");
  return value as Record<string, unknown>;
}
function text(
  value: unknown,
  label: string,
  max: number,
  required = false,
): string {
  if (typeof value !== "string") invalid(`${label}: phải là văn bản.`);
  const result = value.trim();
  if (
    (required && !result) ||
    result.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)
  )
    invalid(
      `${label}: bắt buộc nếu được đánh dấu *, tối đa ${max} ký tự, không chứa ký tự điều khiển.`,
    );
  return result;
}
export function validateId(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    invalid("ID không hợp lệ.");
  return value;
}
export function validateVersion(value: unknown): string {
  const result = text(value, "Phiên bản bản ghi", 40, true);
  if (
    !/^\d{4}-\d{2}-\d{2}T/.test(result) ||
    !Number.isFinite(Date.parse(result))
  )
    invalid("Phiên bản bản ghi không hợp lệ. Hãy tải lại.");
  return result;
}
function slug(value: unknown) {
  const result = text(value, "Slug", 160, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result))
    invalid("Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
  return result;
}
export function validateUrl(value: unknown, required = false): string {
  const result = text(value, "URL", 2048, required);
  if (!result) return result;
  if (
    /^\/(?!\/)[a-zA-Z0-9/_\-.%]+$/.test(result) &&
    !result.includes("..") &&
    !/%(2f|5c|2e|00)/i.test(result)
  )
    return result;
  try {
    const url = new URL(result);
    if (
      url.protocol === "https:" &&
      url.hostname &&
      !url.username &&
      !url.password &&
      !/[\s\\]/.test(result)
    )
      return result;
  } catch {}
  return invalid(
    "URL phải dùng HTTPS hoặc đường dẫn tài nguyên /images/…, không chứa thông tin đăng nhập.",
  );
}
function list(value: unknown, label: string, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max)
    invalid(`${label}: phải là danh sách, tối đa ${max} mục.`);
  return value;
}
export function validateCategory(value: unknown): CategoryInput {
  const row = object(value);
  if (!iconNames.includes(row.icon as CategoryInput["icon"]))
    invalid("Icon không hợp lệ.");
  if (
    typeof row.sort_order !== "number" ||
    !Number.isInteger(row.sort_order) ||
    row.sort_order < 0 ||
    row.sort_order > 99999
  )
    invalid("Thứ tự phải là số nguyên từ 0 đến 99999.");
  if (typeof row.active !== "boolean")
    invalid("Trạng thái danh mục không hợp lệ.");
  return {
    name: text(row.name, "Tên danh mục", 200, true),
    slug: slug(row.slug),
    description: text(row.description, "Mô tả", 1000),
    icon: row.icon as CategoryInput["icon"],
    sort_order: row.sort_order,
    active: row.active,
  };
}
export function validateProduct(value: unknown): ProductInput {
  const row = object(value);
  const sku = text(row.sku, "SKU", 80, true).toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9._-]*$/.test(sku))
    invalid(
      "SKU chỉ gồm chữ không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.",
    );
  if (row.status !== "draft" && row.status !== "published")
    invalid("Trạng thái sản phẩm không hợp lệ.");
  return {
    name: text(row.name, "Tên sản phẩm", 200, true),
    slug: slug(row.slug),
    sku,
    model: text(row.model, "Model", 200),
    brand: text(row.brand, "Thương hiệu", 200),
    category_id: validateId(row.category_id),
    description: text(row.description, "Mô tả ngắn", 1000),
    image: validateUrl(row.image),
    status: row.status,
    introduction: text(row.introduction, "Giới thiệu", 20000),
    applications: text(row.applications, "Ứng dụng", 20000),
    application_items: list(row.application_items, "Ứng dụng", 100).map((v) =>
      text(v, "Nội dung ứng dụng", 2000, true),
    ),
    specifications: list(row.specifications, "Thông số", 200).map((v) => {
      const item = object(v);
      return {
        name: text(item.name, "Tên thông số", 200, true),
        value: text(item.value, "Giá trị", 2000, true),
        unit: text(item.unit, "Đơn vị", 80),
        group: text(item.group, "Nhóm thông số", 200),
      };
    }),
    documents: list(row.documents, "Tài liệu", 50).map((v) => {
      const item = object(v);
      return {
        name: text(item.name, "Tên tài liệu", 200, true),
        href: validateUrl(item.href, true),
      };
    }),
    media: list(row.media, "Thư viện", 50).map((v) => {
      const item = object(v);
      if (item.type === "image")
        return {
          type: "image" as const,
          src: validateUrl(item.src, true),
          alt: text(item.alt, "Mô tả ảnh", 300, true),
        };
      if (item.type === "video")
        return {
          type: "video" as const,
          src: validateUrl(item.src, true),
          title: text(item.title, "Tên video", 300, true),
          poster: validateUrl(item.poster ?? ""),
        };
      return invalid("Loại nội dung phải là image hoặc video.");
    }),
  };
}
