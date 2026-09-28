"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data";
export function NewsList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const result = articles.filter(
    (a) =>
      (!category || a.category === category) &&
      a.title.toLocaleLowerCase("vi").includes(q.toLocaleLowerCase("vi")),
  );
  return (
    <>
      <div className="catalog-toolbar">
        <input
          aria-label="Tìm bài viết"
          placeholder="Tìm kiếm bài viết…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          aria-label="Danh mục bài viết"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Tất cả chủ đề</option>
          {articles.map((a) => (
            <option key={a.category}>{a.category}</option>
          ))}
        </select>
      </div>
      <div className="article-grid space-top">
        {result.map((a) => (
          <article className="article-card" key={a.slug}>
            <Link className="article-image" href={`/tin-tuc/${a.slug}`}>
              <Image
                src={a.image}
                alt={a.title}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </Link>
            <div>
              <span className="article-meta">
                {a.category} · {a.date}
              </span>
              <Link href={`/tin-tuc/${a.slug}`}>
                <h2>{a.title}</h2>
              </Link>
              <p>{a.excerpt}</p>
              <Link className="text-link" href={`/tin-tuc/${a.slug}`}>
                Đọc tiếp →
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!result.length && (
        <div className="empty-state">
          <h2>Không tìm thấy bài viết</h2>
          <p>Hãy thử từ khóa hoặc chủ đề khác.</p>
        </div>
      )}
    </>
  );
}
