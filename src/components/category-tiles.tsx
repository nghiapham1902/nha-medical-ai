import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/catalog";
import { CategoryIcon } from "./category-icons";

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (!categories.length)
    return <p className="empty-state">Danh mục đang được cập nhật.</p>;
  return (
    <div className="category-grid">
      {categories.map((category) => {

        return (
          <Link
            className="category-card"
            href={`/danh-muc/${category.slug}`}
            key={category.id}
          >
            <span>
              <CategoryIcon name={category.icon} size={30} />
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
