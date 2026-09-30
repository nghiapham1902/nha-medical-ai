# Triển khai và vận hành SEO

## Biến môi trường và Vercel

- `NEXT_PUBLIC_SITE_URL` là origin chính thức, ví dụ `https://nha-medical-ai.vercel.app`. Không có path/query; dấu `/` cuối được chuẩn hóa. Production yêu cầu biến này, không chấp nhận localhost; HTTP được chuẩn hóa HTTPS trong SEO. Nên nhập HTTPS ngay từ đầu để kiểm tra CSRF cũng khớp origin.
- Dev vẫn có thể dùng `http://localhost:3000` trong `.env.local`. Khi build production tại máy, đặt biến môi trường HTTPS cho tiến trình build/start thay vì sửa hay commit `.env.local`.
- Giữ Framework Next.js, build `npm run build`, Output Directory `.next-build`, Node 22.x và hai biến Supabase hiện có. Không có migration mới.
- Sau khi người dùng cho phép commit/push, kiểm tra deployment tương ứng đạt Ready. Thay đổi ở workspace chưa tự xuất hiện trên Vercel.
- Kiểm tra `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, trang sản phẩm và trang lỗi. Kiểm tra quyền đăng nhập/lưu admin bằng tài khoản thật của chủ website; bộ test tự động không ghi vào production.

## Crawl/index

- Canonical, OG, Twitter và JSON-LD lấy cùng origin. Danh sách `/san-pham?page=2` và `/danh-muc/[slug]?page=2` có canonical riêng và nội dung SSR; trang 1 canonical không có `page=1`.
- Query tìm kiếm/lọc/sắp xếp có `noindex, follow`, canonical về trang danh sách gốc. Login/register/dashboard giữ noindex. robots.txt không chặn login/register để bot có thể đọc noindex. API/dashboard không nằm trong sitemap.
- Sitemap gồm trang public, sản phẩm published trong danh mục active, danh mục active, bài viết hiện công khai. updated_at thật được dùng cho sản phẩm/danh mục, không tự bịa ngày cho trang tĩnh/bài viết. 60 giây revalidation; thao tác admin thành công tiếp tục gọi `revalidateTag("public-catalog")`.
- Không xóa `public/google612217532e87daf7.html`. Gửi lại sitemap nếu cần sau deploy; kiểm tra URL đang hoạt động cho trang chủ rồi yêu cầu lập chỉ mục khi có thể truy cập.
- Lỗi Search Console "không truy cập được robots.txt" cần được kiểm tra lại trên production. HTTP 200 từ máy kiểm thử không chứng minh Google đã truy cập thành công. Không tắt firewall dựa trên suy đoán và không cam kết thời gian lập chỉ mục/thứ hạng.

## Đổi tên miền

1. Thêm tên miền trong Vercel và cấu hình DNS/TLS theo hướng dẫn Vercel.
2. Đổi `NEXT_PUBLIC_SITE_URL` cho production sang origin HTTPS mới và redeploy. Canonical/sitemap/schema/OG tự đổi, không sửa từng trang.
3. Cấu hình redirect 301/308 từ domain cũ sang domain mới, giữ nguyên path/query. Biến môi trường SEO không tự tạo redirect cho domain cũ.
4. Xác minh domain mới trong Search Console, gửi sitemap mới; dùng công cụ chuyển địa chỉ khi phù hợp. Cập nhật cấu hình Supabase URL redirect nếu sau này dùng luồng xác thực có redirect.

## Giới hạn chủ động giữ lại

- Product JSON-LD không có giá, Offer, review hay rating vì không có dữ liệu đó. Schema có thể hợp lệ về cấu trúc nhưng không đủ điều kiện Product rich results của Google.
- Bài viết hiện có là nội dung tham khảo/demo và phần giới thiệu công ty chưa xác minh hồ sơ. Giữ thông báo biên tập thật; chỉ bỏ nhãn demo chung khỏi metadata/branding. Ngày Article lấy từ ngày đã hiển thị, không khẳng định đó là ngày đã xác minh độc lập.
- Form liên hệ chỉ lưu localStorage; cảnh báo, consent và nút demo vẫn còn. Không có backend gửi yêu cầu mới.
- Ảnh vendor vẫn `unoptimized`; chỉ ảnh dưới `/images/` nội bộ được tối ưu. Nguồn ảnh bên ngoài có thể chậm/thay đổi và cần kiểm soát quyền sử dụng riêng.
- Danh sách phân trang SSR nhưng vẫn đọc/truyền tập sản phẩm hiện tại để giữ UX lọc tức thời. Khi dữ liệu lớn cần pagination/filter ở tầng database; Supabase có giới hạn số hàng mặc định. Không thay đổi schema trong đợt này.
- Không có script lint/ESLint trong package.json. Dùng typecheck, build, Prettier trên file thay đổi và Playwright. Chưa có dữ liệu field Core Web Vitals; không tuyên bố điểm số Lighthouse hay hiệu quả SEO thực tế khi chưa đo.

## Tài liệu tham chiếu

- https://nextjs.org/docs/app/api-reference/file-conventions/not-found
- https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://support.google.com/webmasters/answer/7451001
