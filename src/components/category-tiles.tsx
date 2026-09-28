import Link from "next/link";
import {
  Microscope,
  Package,
  HeartPulse,
  TestTubes,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import type { Category } from "@/lib/catalog";
const icons = {
  Microscope,
  Package,
  HeartPulse,
  TestTubes,
  FlaskConical,
  ShieldCheck,
};
export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (!categories.length)
    return <p className="empty-state">Danh mục đang được cập nhật.</p>;
  return (
    <div className="category-grid">
      {categories.map((category) => {
        const Icon = icons[category.icon] || Package;
        return (
          <Link
            className="category-card"
            href={`/danh-muc/${category.slug}`}
            key={category.id}
          >
            <span>
              <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3>{category.name}</h3>
            <small>
              Xem sản phẩm
              <ChevronRight size={13} aria-hidden="true" />
            </small>
          </Link>
        );
      })}
    </div>
  );
}
