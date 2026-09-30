# SEO audit — 30 September 2026

## Before changes

- Public/indexable: home, catalogue, active categories, published products, about, contact, news index and three static public articles. Root enables indexing in production. Login/registration/dashboard already noindex; cart redirects. API is not a search landing page.
- Site URL falls back to localhost with no validation/HTTPS normalization. Relative canonicals rely on metadataBase. Child OG overrides do not explicitly retain default images. Product titles omit model/brand absent from name; descriptions may be empty.
- Home/root/about/news metadata, Organization, OG caption and generic footer contain demo marketing text. Functional contact warnings must stay because submissions only write localStorage. Articles/about retain honest notices: editorial/company credentials have not been independently verified. Fixtures/tests/docs mentioning demo are not marketing.
- Existing JSON-LD: Organization (no logo), Product (no URL, possibly relative image), Article (fabricated 08:00 time, hardcoded date year/month, no publisher/mainEntityOfPage). No WebSite/BreadcrumbList. No fabricated offers/reviews currently.
- Sitemap includes static public routes, published products in active categories, active categories and public articles. updated_at exists but is omitted. priority/changeFrequency are unnecessary.
- Store layout/home/catalogue/category/product/sitemap force dynamic despite 60s anonymous tagged repository cache. Streaming/loading may produce HTTP 200 for missing records. Authenticated reads remain separate and uncached.
- Pagination is client-only: later product cards have no crawlable page links. Filter/search URLs lack explicit noindex. Home links to categories/news; products link category/related products; articles lack contextual catalogue links.
- ProductCard/Gallery always unoptimized. Live public product sources include www.zeiss.com, www.micro-shop.zeiss.com, encrypted-tbn0.gstatic.com, www.thermofisher.com, cf-images.us-east-1.prod.boltdns.net, pim-resources.coleparmer.com, www.ate-medical.com. Vendor image URLs remain direct; optimize local images only. Hero already priority/responsive; next/font already swap.
- Main/nav/card semantics mostly exist. Home H1 only slogan, catalogue headings skip levels, breadcrumbs incomplete, article breadcrumb is a div.
- Live robots.txt and sitemap returned HTTP 200 in prior checks, while Search Console reported robots.txt unreachable. This discrepancy requires external crawling/log checks; no proven code-level robots failure.

## Planned scope

Central URL/metadata helpers, reusable schemas, complete HTML breadcrumbs, canonical URL pagination with filter noindex, safe ISR, actual modified dates, strict 404 validation, semantic home heading and honest copy. No database/auth/admin logic changes; no fake claims/prices/reviews; no commit/push.

Catalogue/category list routes retain request rendering for searchParams. Home/product/public layouts/sitemap use revalidation when safe. Validate missing records in blocking metadata before streaming to retain HTTP 404. Preserve contact demo disclosures and editorial notices. See final report for test evidence and limitations.
