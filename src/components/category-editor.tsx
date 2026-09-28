import {
  Microscope,
  Package,
  HeartPulse,
  TestTubes,
  FlaskConical,
  ShieldCheck,
  Check,
  ChevronRight,
} from "lucide-react";
import { iconNames, type CategoryInput } from "@/lib/catalog";

const icons = {
  Microscope,
  Package,
  HeartPulse,
  TestTubes,
  FlaskConical,
  ShieldCheck,
};
const labels = {
  Microscope: "Kính hiển vi",
  Package: "Vật tư y tế",
  HeartPulse: "Chăm sóc sức khỏe",
  TestTubes: "Xét nghiệm",
  FlaskConical: "Phòng thí nghiệm",
  ShieldCheck: "Bảo hộ y tế",
};

export function CategoryIcon({
  name,
  size = 24,
}: {
  name: CategoryInput["icon"];
  size?: number;
}) {
  const Icon = icons[name] || Package;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}

export function CategoryEditor({
  category,
  onChange,
}: {
  category: CategoryInput;
  onChange: (value: CategoryInput) => void;
}) {
  return (
    <div className="category-editor-layout">
      <div className="category-editor-main">
        <section
          className="category-editor-section"
          aria-labelledby="category-info-heading"
        >
          <h2 id="category-info-heading">Thông tin danh mục</h2>
          <p>Đặt tên và mô tả để khách hàng dễ tìm sản phẩm.</p>
          <div className="form-grid">
            <label>
              Tên danh mục *
              <input
                required
                maxLength={200}
                placeholder="Ví dụ: Vật tư y tế"
                value={category.name}
                onChange={(e) =>
                  onChange({ ...category, name: e.target.value })
                }
              />
            </label>
            <label>
              Slug *
              <input
                required
                maxLength={160}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="vat-tu-y-te"
                value={category.slug}
                onChange={(e) =>
                  onChange({ ...category, slug: e.target.value })
                }
                aria-describedby="category-slug-help"
              />
              <small id="category-slug-help">
                Dùng chữ thường không dấu, phân cách bằng dấu gạch ngang.
              </small>
            </label>
          </div>
          <label>
            Mô tả ngắn
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="Giới thiệu ngắn về nhóm sản phẩm này…"
              value={category.description}
              onChange={(e) =>
                onChange({ ...category, description: e.target.value })
              }
            />
          </label>
        </section>
        <section
          className="category-editor-section"
          aria-labelledby="category-icon-heading"
        >
          <h2 id="category-icon-heading">Biểu tượng danh mục</h2>
          <p>Chọn biểu tượng phù hợp để hiển thị trên website.</p>
          <div
            className="category-icon-grid"
            role="radiogroup"
            aria-labelledby="category-icon-heading"
          >
            {iconNames.map((name) => (
              <label className="category-icon-option" key={name}>
                <input
                  type="radio"
                  name="category-icon"
                  value={name}
                  checked={category.icon === name}
                  onChange={() => onChange({ ...category, icon: name })}
                />
                <span className="category-icon-tile">
                  <CategoryIcon name={name} size={28} />
                  <span>{labels[name]}</span>
                  {category.icon === name && (
                    <Check
                      className="category-icon-check"
                      size={15}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
      <aside className="category-editor-aside">
        <section
          className="category-preview"
          aria-labelledby="category-preview-heading"
        >
          <h2 id="category-preview-heading">Xem trước danh mục</h2>
          <div className="category-preview-card">
            <span className="category-preview-icon">
              <CategoryIcon name={category.icon} size={34} />
            </span>
            <h3>{category.name.trim() || "Tên danh mục"}</h3>
            <span className="category-preview-link">
              Xem sản phẩm <ChevronRight size={14} aria-hidden="true" />
            </span>
          </div>
          <small>Biểu tượng và tên hiển thị trên website.</small>
        </section>
        <section
          className="category-settings"
          aria-labelledby="category-settings-heading"
        >
          <h2 id="category-settings-heading">Cài đặt hiển thị</h2>
          <label>
            Thứ tự hiển thị
            <input
              type="number"
              min={0}
              max={99999}
              required
              value={category.sort_order}
              onChange={(e) =>
                onChange({ ...category, sort_order: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Trạng thái
            <select
              value={String(category.active)}
              onChange={(e) =>
                onChange({ ...category, active: e.target.value === "true" })
              }
            >
              <option value="true">Hiển thị</option>
              <option value="false">Ẩn</option>
            </select>
          </label>
          <p>
            Ẩn danh mục cũng ẩn các sản phẩm thuộc danh mục ngoài website; liên
            kết dữ liệu vẫn được giữ nguyên.
          </p>
        </section>
      </aside>
    </div>
  );
}
