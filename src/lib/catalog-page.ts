import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { repository } from "./repository";
import {
  catalogQuery,
  filterProducts,
  pageSize,
  type CatalogSearchParams,
} from "./catalog-query";

// Shared by blocking metadata and the page so invalid page URLs return HTTP 404.
export const loadCatalogPage = cache(
  async (params: Promise<CatalogSearchParams>, slug?: string) => {
    const state = catalogQuery(await params);
    if (!state.valid) notFound();
    const categories = await repository.getCategories();
    const category = slug ? categories.find((c) => c.slug === slug) : undefined;
    if (slug && !category) notFound();
    if (!slug && state.category) {
      const legacyCategory = categories.find(
        (c) => c.slug === state.category || c.name === state.category,
      );
      if (!legacyCategory) notFound();
      redirect(`/danh-muc/${legacyCategory.slug}`);
    }
    const products = await repository.getProducts(category?.id);
    const count = filterProducts(
      products,
      state.query,
      state.brand,
      state.sort,
    ).length;
    if (state.page > Math.max(1, Math.ceil(count / pageSize))) notFound();
    return { state, categories, category, products };
  },
);
