# Báo cáo SEO — NHA Medical

Hoàn tất thay đổi trong workspace ngày 30/09/2026. **Chưa commit, push hoặc triển khai lên Vercel.** Kết quả dưới đây đo trên production build chạy cục bộ, dùng canonical `https://nha-medical-ai.vercel.app` và dữ liệu catalogue công khai hiện có. Không ghi vào database production.

## 1. File đã thay đổi

| Nhóm                  | File                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL, metadata, schema | `src/lib/seo.ts`, **mới** `src/components/structured-data.tsx`                                                                                                                            |
| Truy vấn/phân trang   | **mới** `src/lib/catalog-query.ts`, **mới** `src/lib/catalog-page.ts`, `src/components/catalog.tsx`                                                                                       |
| Layout/trang chủ      | `src/app/layout.tsx`, `src/app/(store)/layout.tsx`, `src/app/(store)/page.tsx`                                                                                                            |
| Danh sách/chi tiết    | `src/app/(store)/san-pham/page.tsx`, `src/app/(store)/san-pham/[slug]/page.tsx`, `src/app/(store)/danh-muc/[slug]/page.tsx`                                                               |
| Nội dung              | `src/app/(store)/gioi-thieu/page.tsx`, `src/app/(store)/lien-he/page.tsx`, `src/app/(store)/tin-tuc/page.tsx`, `src/app/(store)/tin-tuc/[slug]/page.tsx`                                  |
| Crawl/chia sẻ         | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`                                                                                                                  |
| Ảnh và giao diện      | **mới** `src/lib/image-policy.ts`, `src/components/product-gallery.tsx`, `src/components/store.tsx`, `src/app/globals.css`                                                                |
| HTTP 404              | `next.config.ts`; chuyển `src/app/loading.tsx` sang `src/app/dashboard/loading.tsx`; bỏ loading ở `src/app/(store)/san-pham/loading.tsx` và `src/app/(store)/danh-muc/[slug]/loading.tsx` |
| Kiểm tra              | **mới** `tests/seo.spec.ts`, `tests/site.spec.ts`                                                                                                                                         |
| Tài liệu              | `README.md`; **mới** `docs/seo-audit.md`, `docs/seo-deployment.md`, `docs/seo-report.md`, `docs/seo-verification.json`                                                                    |

Không đổi package/dependency, `.env.local`, database schema, Supabase Auth, API admin hay dữ liệu sản phẩm. Giữ nguyên tệp xác minh Google.

## 2. Vấn đề phát hiện

- Site URL có thể rơi về localhost khi production thiếu cấu hình; chưa chuẩn hóa HTTPS/origin.
- Metadata còn nhãn demo, fallback mô tả chưa nhất quán; ảnh OG không được khai báo đầy đủ ở metadata con.
- Trang chủ dùng slogan làm H1, thiếu heading mô tả lĩnh vực.
- Schema thiếu WebSite/BreadcrumbList, URL/ảnh tuyệt đối cho Product, publisher cho Article; giờ xuất bản Article được tự gán.
- Sitemap chưa dùng `updated_at` thật; pagination chỉ có state phía client; query lọc chưa có noindex riêng.
- Public routes bị force-dynamic dù repository đã có cache vô danh 60 giây.
- Loading/Suspense làm phản hồi bắt đầu quá sớm: route thiếu dữ liệu trả HTTP 200 và HTML ban đầu có thể thêm H1 của loading.
- Mọi ảnh sản phẩm đều bỏ tối ưu kể cả ảnh nội bộ. Thông báo thành công của form demo từng hướng người dùng đến mục báo giá không có trong dashboard.
- Search Console báo không truy cập được robots.txt, trong khi phép kiểm tra HTTP độc lập nhận 200; chưa đủ chứng cứ để quy nguyên nhân cho firewall hoặc mã nguồn.

## 3. Đã sửa

- Chuẩn hóa origin dùng chung cho canonical, schema, sitemap và social metadata. Production bắt buộc `NEXT_PUBLIC_SITE_URL`, từ chối localhost/path/credentials, chuẩn hóa HTTPS.
- Mỗi trang public chính có title, description, canonical và OG/Twitter đầy đủ trong HTML server; title sản phẩm tránh lặp model/hãng đã có trong tên.
- H1 trang chủ nêu thiết bị y tế và phòng thí nghiệm; giữ slogan, bố cục và màu sắc hiện tại.
- Thêm schema và breadcrumb HTML, liên kết từ bài viết sang danh mục liên quan, giữ liên kết sản phẩm liên quan.
- SSR pagination có URL `?page=2`, liên kết crawl được, canonical riêng, thứ tự ổn định. Reload giữ trang/lọc từ URL; trang vượt phạm vi hoặc sai định dạng trả 404. Query lọc/tìm kiếm/sắp xếp có noindex và canonical về danh sách gốc.
- Bỏ streaming loading ở public và đợi metadata cho mọi user agent bằng `htmlLimitedBots: /.*/` để giữ mã HTTP 404 thật. Loading dashboard vẫn còn.
- Bỏ demo trong branding/metadata chung; giữ cảnh báo chức năng và nội dung tham khảo. Form xác nhận đúng rằng yêu cầu chỉ lưu trên trình duyệt.

## 4. Phần còn lại và giới hạn

- Lỗi robots.txt trong Search Console cần kiểm tra lại trên deployment mới và log truy cập Google. Không thể xác nhận đã khắc phục chỉ từ build cục bộ hoặc một HTTP 200. Không thay firewall khi chưa có chứng cứ.
- Nội dung bài viết/hồ sơ công ty và thông tin liên hệ hiện có cần chủ website xác minh. Không tự bổ sung chứng nhận, đối tác, thành tích hay chuyên gia.
- Form liên hệ chưa có backend gửi yêu cầu; cảnh báo demo vẫn hiển thị rõ.
- Product schema không có giá/Offer/review/rating. Vì không có dữ liệu thật, không đáp ứng một số yêu cầu Product rich results của Google; không tạo dữ liệu để vượt kiểm tra.
- Ảnh vendor vẫn tải trực tiếp; tốc độ/khả dụng phụ thuộc nguồn. Không mở wildcard remotePatterns.
- Bộ lọc vẫn hoạt động tức thì phía client. Thao tác gõ/reset không tự cập nhật URL ngay; liên kết phân trang mang trạng thái lọc hiện tại. Danh sách vẫn nhận toàn bộ tập sản phẩm được repository trả về; cần phân trang tại database khi catalogue lớn.
- Không có tài khoản/môi trường Supabase thử nghiệm riêng nên chưa chạy bài CRUD/Auth integration thật, chưa xác minh thao tác admin làm mới cache bằng một lần ghi thực tế. Đường gọi `revalidateTag("public-catalog")` hiện có được giữ nguyên.
- Chưa đo Lighthouse hay Core Web Vitals ngoài thực tế. Không cam kết thứ hạng hoặc thời gian Google lập chỉ mục.

## 5. Metadata mẫu từ HTML production

Origin của các canonical: `https://nha-medical-ai.vercel.app`.

| Trang     | Title thực tế                                                                 | Canonical path                                                             |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Trang chủ | Thiết bị Y tế & Phòng thí nghiệm \| NHA Medical                               | `/`                                                                        |
| Danh mục  | Kính hiển vi \| NHA Medical                                                   | `/danh-muc/kinh-hien-vi`                                                   |
| Sản phẩm  | Đầu camera nội soi phẫu thuật Schölly FLEXIVISION 4K UHD Zoom \| NHA Medical  | `/san-pham/dau-camera-noi-soi-phau-thuat-schoelly-flexivision-4k-uhd-zoom` |
| Bài viết  | Những điều cần cân nhắc khi lựa chọn thiết bị phòng thí nghiệm \| NHA Medical | `/tin-tuc/lua-chon-thiet-bi-phong-thi-nghiem`                              |

Description trang chủ: “Tìm hiểu thiết bị y tế, thiết bị phòng thí nghiệm và vật tư tại NHA Medical. Tham khảo thông tin sản phẩm và trao đổi nhu cầu tư vấn lựa chọn thiết bị phù hợp.”

Description danh mục: “Tìm hiểu kính hiển vi tại NHA Medical. Tham khảo sản phẩm, thông số và trao đổi nhu cầu lựa chọn thiết bị phù hợp.”

Description sản phẩm: “Đầu camera nội soi 4K UHD dùng cảm biến 3CMOS, hỗ trợ zoom quang 2×, ba phím chức năng có đèn và kết nối khóa với thị kính ống nội soi tiêu chuẩn.”

Description bài viết: “Từ nhu cầu sử dụng đến dịch vụ hậu mãi: xây dựng danh sách yêu cầu trước khi đầu tư thiết bị.”

OG/Twitter dùng title/description tương ứng; Product dùng ảnh sản phẩm, Article dùng ảnh bài viết; mặc định dùng `/opengraph-image`. Bản trích đầy đủ gồm schema: [seo-verification.json](seo-verification.json).

## 6. Structured data

- Trang chủ: Organization và WebSite, chung ID tổ chức, logo và URL tuyệt đối; không khai báo thông tin công ty chưa xác minh.
- Danh mục/sản phẩm/bài viết: BreadcrumbList khớp breadcrumb hiển thị.
- Product: tên, mô tả hiện có, SKU, model, brand, ảnh, URL, thông số thật. Không Offer/rating/review.
- Article: headline, description, ảnh, publisher, mainEntityOfPage, ngày từ nội dung đang hiển thị; không tự gán giờ hoặc dateModified. Giữ ghi chú nội dung tham khảo.
- Tất cả JSON-LD được escape ký tự `<` và đã parse thành công trong test.

## 7. Sitemap và robots

Sitemap hiện có **21 URL**: 5 trang chính, 3 bài viết, 7 sản phẩm công khai và 6 danh mục active. Có **13 lastmod** lấy từ `updated_at` sản phẩm/danh mục. Không thêm thời gian giả cho trang tĩnh/bài viết; bỏ priority/changefreq. Sitemap làm mới theo revalidation 60 giây, dùng chung domain từ environment.

Robots cho phép website công khai, chặn `/dashboard` và `/api/`, dẫn đến sitemap tuyệt đối. Login/register không bị robots chặn để bot có thể đọc noindex. Login/register/dashboard không đưa vào sitemap. File robots trả 200 `text/plain`; sitemap trả 200 `application/xml` trong kiểm tra cục bộ.

## 8. Performance

- Public layout/home/product/sitemap dùng revalidate 60 giây thay cho force-dynamic khi an toàn; catalogue/category vẫn render theo request do searchParams.
- Home và một product thực tế trả `x-nextjs-cache: HIT`, `s-maxage=60` trong production cục bộ. Cache chỉ dùng dữ liệu catalogue vô danh; không cache phiên/admin.
- Chỉ ảnh nội bộ `/images/` đi qua Next Image; thêm sizes phù hợp, giữ lazy loading/default và ưu tiên hero hiện có. Next/font giữ `display: swap`.
- Đợi metadata và bỏ public loading tăng thời gian chờ phản hồi đầu ở cache miss; đổi lại metadata và mã 404 chính xác. Không khẳng định mọi chỉ số tốc độ đều tốt hơn khi chưa đo.

## 9. Kết quả kiểm tra

| Kiểm tra                                         | Kết quả                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `npm run build` với production origin            | Đạt, Next.js 15.5.26; Output `.next-build`                                                        |
| `npm run typecheck`                              | Đạt                                                                                               |
| `npm run test:browser` trên production port 3100 | **25 passed, 1 skipped**, 27.5 giây                                                               |
| Supabase integration ghi dữ liệu thật            | Bỏ qua theo cấu hình mặc định; cần dự án thử nghiệm riêng                                         |
| SQL/RLS/constraints trong PGlite tạm             | Đạt trong bộ test                                                                                 |
| Metadata HTML không JavaScript                   | Một H1/canonical; title/description/OG hiện trong head; trang public chính không noindex          |
| Phân trang/filter                                | Có và không JavaScript đều đạt; URL trang 2/reload/noindex query đạt                              |
| Route thiếu sản phẩm/danh mục/bài viết, page sai | HTTP **404**                                                                                      |
| Responsive/theme                                 | Đạt các kích thước 360/390/768/1440 theo bộ test; xem ảnh desktop/mobile sáng/tối                 |
| OG image                                         | HTTP 200, PNG 1200×630, đã xem ảnh                                                                |
| Lint                                             | Project không có script lint/ESLint; không tự thêm dependency. Dùng TypeScript, build và Prettier |

Prettier trên các file thay đổi và `git diff --check` đều đạt. Build có cảnh báo static generation không áp dụng cho route ảnh OG dùng edge runtime; route ảnh vẫn trả 200. Khi thử slug bài viết không tồn tại, Next.js ghi `Internal: NoFallbackError` trong server log; phản hồi HTTP vẫn là 404 và bài kiểm tra đạt. Chưa thay cơ chế static params của bài viết chỉ để loại thông báo này.

Ảnh kiểm tra nằm trong `test-results/` (thư mục ignored, lượt test sau có thể ghi đè). Không dùng kiểm tra local để khẳng định Google đã index hoặc dashboard CRUD production đã được kiểm thử.

## 10. Sau khi người dùng push lên GitHub

1. Vercel → Environment Variables: đặt `NEXT_PUBLIC_SITE_URL=https://nha-medical-ai.vercel.app` cho Production. Giữ biến Supabase đúng; không đưa `.env.local` lên GitHub.
2. Build settings: Next.js; thư mục gốc chứa package.json của app; Build Command `npm run build`; Output Directory **`.next-build`**. Không đổi thành `.next` vì config hiện tại dùng `.next-build`.
3. Chờ deployment của commit mới Ready. Environment mới chỉ có hiệu lực với deployment mới.
4. Kiểm tra trang chủ, sản phẩm, trang 2, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` và URL sai trả 404. Chủ website kiểm tra đăng nhập/dashboard/lưu nội dung thật.
5. Search Console → Sơ đồ trang web: gửi `sitemap.xml`; dùng Kiểm tra URL đang hoạt động cho **trang chủ**, rồi yêu cầu lập chỉ mục nếu đủ điều kiện. Không cần yêu cầu sitemap.xml xuất hiện như một kết quả tìm kiếm.
6. Nếu Google vẫn không đọc được robots.txt: xem mã HTTP/lỗi cụ thể, Vercel request/firewall logs tại thời điểm thử; xử lý dựa trên chứng cứ rồi thử lại. Không gửi lại liên tục để thay cho chẩn đoán.

Hướng dẫn đổi domain, giới hạn và nguồn chính thức: [seo-deployment.md](seo-deployment.md). Audit ban đầu: [seo-audit.md](seo-audit.md).
