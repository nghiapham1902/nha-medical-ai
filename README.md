# NHA Medical

Website catalogue thiết bị y tế tiếng Việt: Next.js 15 App Router, TypeScript, Tailwind CSS 4, Lucide. Quản trị danh mục và sản phẩm dùng Supabase PostgreSQL + Auth. Không có thanh toán, giá bán hoặc so sánh sản phẩm.

## Cài đặt

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

Node.js >= 20; nên dùng Node.js 22 LTS. Các phiên bản SDK Supabase được khóa trong package-lock để tương thích môi trường hiện tại. Chạy ứng dụng bằng Node/server hoặc nền tảng hỗ trợ Next.js; không dùng static export.

## Cấu hình Supabase

1. Tạo dự án Supabase. Sao chép `.env.example` thành `.env.local` (không commit file này).
2. Điền các biến sau rồi khởi động lại Next.js:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

`SUPABASE_PUBLISHABLE_KEY` nhận publishable key `sb_publishable_…` hoặc legacy `anon` key. **Không dùng secret key/service_role**: ứng dụng từ chối loại khóa này, không cần khóa bỏ qua RLS. Các biến Supabase chỉ đọc phía server, không có tiền tố `NEXT_PUBLIC_`. `NEXT_PUBLIC_SITE_URL` phải khớp chính xác origin (scheme/host/port) của website để kiểm tra CSRF. Production dùng HTTPS. Không ghi mật khẩu admin, DB password hoặc access token vào source/log.

Chưa cấu hình: catalogue hiển thị trạng thái trống, sản phẩm/danh mục không tồn tại dùng not-found; API quản trị trả 503. Không tự chuyển sang sản phẩm demo. Có cấu hình nhưng truy vấn lỗi: hiển thị error boundary, không che lỗi bằng dữ liệu giả.

Dữ liệu catalogue công khai được cache phía server với chu kỳ làm mới 60 giây. Thao tác lưu/xóa thành công qua API quản trị xóa cache catalogue; lần đọc tiếp theo lấy dữ liệu mới. Nếu sửa trực tiếp trong Supabase, lần truy cập sau khi cache hết hạn kích hoạt làm mới nền. Truy vấn quản trị và phiên đăng nhập không dùng cache này.

### Migration và khởi tạo danh mục

Dùng SQL Editor của Supabase với tài khoản sở hữu dự án:

1. Chạy lần lượt `database/migrations/001_catalog.sql` và `database/migrations/002_category_icons.sql`. Với dự án mới có thể chạy `database/schema.sql` thay cho các migration, **không chạy cả hai cách**. Dự án đã chạy migration 001 chỉ cần chạy 002 để bổ sung lựa chọn icon.
2. Chạy `database/seed.sql`: tạo sáu danh mục ban đầu, icon và thứ tự. Có thể chạy lại; không ghi đè danh mục đã chỉnh sửa.
3. Kiểm tra tables `categories`, `products`, `catalog_admins`, RLS và các policy sau khi chạy.

Migration chạy trong transaction, không DROP bảng hoặc sửa dữ liệu thật. Schema cũ trong workspace trước đây chỉ là bản tham khảo. Nếu đã áp dụng schema cũ lên một database, **không chạy đè** migration mới: sao lưu và lập migration ALTER riêng theo cấu trúc/thực tế dữ liệu. Migration sẽ dừng khi gặp bảng trùng, không tự xóa bảng.

Không seed sản phẩm: các sản phẩm/giá/ảnh trong `src/lib/data.ts` là fixture demo cũ, không tự nhập vào Supabase hoặc gán vào danh mục. Nội dung kỹ thuật phải được kiểm chứng trước khi nhập/xuất bản.

### Tạo tài khoản quản trị

1. Supabase Dashboard → Authentication → Users → Add user: tạo người dùng bằng email và mật khẩu riêng, xác nhận email theo thiết lập dự án. Không bật đăng ký công khai cho nhu cầu quản trị này.
2. Sao chép User UID rồi chạy trong SQL Editor (thay placeholder):

```sql
insert into public.catalog_admins(user_id)
values ('USER_UUID_FROM_AUTH')
on conflict do nothing;
```

3. Mở `/dang-nhap`, đăng nhập bằng tài khoản đó rồi vào `/dashboard`.
4. Thu hồi quyền bằng `delete from public.catalog_admins where user_id = 'USER_UUID_FROM_AUTH';`. API kiểm tra quyền mỗi lần; người dùng không thể tự thêm quyền bằng metadata hay gọi REST.

Không tạo role admin qua UI hoặc endpoint công khai. Trang `/dang-ky` hiện không tạo tài khoản. Đăng xuất bằng nút trong dashboard; cookie phiên HttpOnly, SameSite=Lax, Secure ở production. Supabase Auth áp dụng giới hạn đăng nhập theo cấu hình dự án; bật cấu hình bảo vệ phù hợp tại Supabase khi triển khai.

## Quản lý nội dung

- **Danh mục:** tên, slug duy nhất (chữ thường không dấu/số/gạch ngang), mô tả ngắn, một trong 15 icon Lucide (bao gồm phẫu thuật, hồi sức, chẩn đoán hình ảnh, sản khoa, kiểm soát nhiễm khuẩn, vi sinh, nội soi, sinh thiết và tiết niệu), thứ tự, Hiển thị/Ẩn. Hiển thị tăng dần theo thứ tự rồi tên.
- **Sản phẩm:** tên, slug, SKU duy nhất (chuẩn hóa viết hoa), model/thương hiệu tùy chọn, một danh mục chính, mô tả ngắn, ảnh chính, thư viện ảnh/video, tài liệu, Nháp/Đã xuất bản.
- **Chi tiết:** Giới thiệu → Ứng dụng & lựa chọn (đoạn văn và/hoặc mỗi dòng một ý) → Thông số kỹ thuật. Phần Giới thiệu có trình soạn thảo Tiptap: tiêu đề, đậm/nghiêng/gạch chân, danh sách, liên kết, ảnh bằng URL kèm chú thích, bảng, hoàn tác/làm lại. Bôi đen chữ trước khi chèn liên kết. Nhấn Lưu sản phẩm để lưu bài viết; không tự lưu. Giới hạn 20.000 ký tự gồm định dạng. Dòng thông số có tên, giá trị, đơn vị và nhóm tùy chọn; thêm/xóa và nút Lên/Xuống để đổi thứ tự. Trường trống không hiển thị.

Bài viết dùng cột `introduction` hiện có, có dấu nhận diện `<!--nha-article-v1-->`; không cần migration. Văn bản cũ vẫn hiển thị như văn bản thuần và được chuyển thành đoạn văn khi chỉnh sửa bằng trình soạn thảo. Nội dung định dạng được lọc HTML theo danh sách cho phép ở API khi lưu và ở trang sản phẩm khi hiển thị; không cho phép script, iframe, style hay thuộc tính sự kiện.

- Ảnh/video/tài liệu dùng URL HTTPS hoặc đường dẫn public hiện có. Chưa có chức năng upload file; có thể đưa file đã xác minh vào Supabase Storage bằng Dashboard rồi lấy URL công khai. Video dùng URL tệp trực tiếp. Không dùng signed URL ngắn hạn cho catalogue lâu dài.
- Ảnh sản phẩm dùng `next/image` với `unoptimized` để URL ngoài được tải trực tiếp ở trình duyệt, không mở trình tối ưu ảnh server cho host tùy ý. Không tạo ảnh khác model, không lấy ảnh minh họa danh mục làm ảnh sản phẩm.
- Ẩn danh mục giữ nguyên khóa ngoại và trạng thái sản phẩm, nhưng các sản phẩm đó không xuất hiện công khai. Hiện lại danh mục sẽ hiện lại những sản phẩm đã xuất bản; muốn giữ ẩn một sản phẩm thì chuyển sản phẩm về Nháp.
- Không xóa danh mục có bất kỳ sản phẩm nào, kể cả Nháp. Chuyển sản phẩm sang danh mục khác hoặc ẩn danh mục. Database FK `ON DELETE RESTRICT` bảo vệ cả khi có thao tác đồng thời.
- Cập nhật/xóa dùng `updated_at` để phát hiện chỉnh sửa đồng thời; nếu lỗi 409, tải lại bản ghi mới trước khi sửa tiếp. Mỗi lần lưu hiển thị trạng thái thành công/lỗi rõ ràng.

## Các tuyến và bảo mật

- `/san-pham`: danh mục hoạt động và sản phẩm đã xuất bản; tìm kiếm tên/SKU/model, lọc hãng, phân trang.
- `/danh-muc/[slug]`: chỉ sản phẩm đã xuất bản thuộc danh mục đang hiển thị. Query danh mục cũ `/san-pham?category=…` chuyển sang URL mới nếu khớp slug/tên thật; không tìm thấy dùng not-found.
- `/san-pham/[slug]`: nội dung thật từ repository; CTA truyền tên vào form liên hệ.
- `/api/admin/categories`, `/api/admin/products`: GET danh sách; POST tạo; PUT sửa; DELETE xóa. PUT/DELETE cần `id` và `updated_at` bản ghi hiện tại. Không hỗ trợ mass assignment ID/thời điểm/quyền/giá; server chỉ lấy các trường được phép.
- API kiểm tra đăng nhập bằng Supabase Auth và membership `catalog_admins`; cùng-origin cho mutation, kiểm tra JSON/giới hạn request 500 KB. DB áp dụng RLS cho cả REST trực tiếp: khách/non-admin chỉ đọc danh mục active và sản phẩm published thuộc danh mục active.
- Public repository luôn dùng client **anonymous**, kể cả người xem đang là admin, tránh rò rỉ bản nháp. Chỉ dữ liệu công khai được cache 60 giây với tag `public-catalog`; sitemap lấy cùng nguồn và không chứa bản nháp/danh mục ẩn.
- Cookie admin và phản hồi quản trị không cache. Không proxy/cache CDN phản hồi có Set-Cookie. Dùng `middleware.ts` theo Next.js 15 để refresh phiên.
- Sản phẩm/danh mục và phân trang không tồn tại trả HTTP 404. Metadata kiểm tra bản ghi trước khi trả HTML; các loading boundary public được gỡ để không phát HTTP 200 trước `notFound`. Loading của dashboard vẫn được giữ.

Tài liệu nền tảng: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Next.js not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found).

## Kiểm tra

Chạy server trước (dev hoặc production), rồi trong terminal khác:

```bash
npm run typecheck
npm run build
npm run test:browser
```

Playwright dùng Edge (`channel: msedge`). `PLAYWRIGHT_BASE_URL` đổi địa chỉ server nếu cần. Bộ kiểm tra mặc định gồm validation server, URL không an toàn, nội dung ba phần/ẩn phần trống/escape HTML, public responsive, anonymous bị chặn, CSRF, metadata/not-found, CTA và theme. Dữ liệu trong unit test là fixture nằm trong bộ nhớ, không ghi lên database.

### Kiểm thử CRUD và RLS trên Supabase thật

`tests/catalog-integration.spec.ts` được **skip mặc định**. Chỉ bật trên một **dự án Supabase thử nghiệm riêng**, đã chạy migration, với hai tài khoản: admin và người dùng không có quyền admin. Không chạy trên production. Khởi động app với SUPABASE_URL/KEY trỏ đúng dự án thử nghiệm; cấu hình những biến sau trong terminal chạy Playwright:

```dotenv
RUN_SUPABASE_INTEGRATION=1
SUPABASE_TEST_URL=https://TEST_PROJECT.supabase.co
SUPABASE_TEST_PUBLISHABLE_KEY=TEST_PROJECT_PUBLISHABLE_KEY
SUPABASE_TEST_ADMIN_EMAIL=ADMIN_TEST_EMAIL
SUPABASE_TEST_ADMIN_PASSWORD=ADMIN_TEST_PASSWORD
SUPABASE_TEST_MEMBER_EMAIL=MEMBER_TEST_EMAIL
SUPABASE_TEST_MEMBER_PASSWORD=MEMBER_TEST_PASSWORD
```

```bash
npx playwright test tests/catalog-integration.spec.ts
```

Test tạo bản ghi có tiền tố `integration-` và ID riêng, kiểm tra CRUD, slug/SKU trùng, RLS anon/member, không tự cấp admin, Nháp/Đã xuất bản, ẩn danh mục, chặn xóa danh mục có sản phẩm, chuyển danh mục, nội dung chi tiết, CTA, xóa và đăng xuất. `finally` dọn đúng bản ghi của lượt chạy. Nếu test/process bị dừng đột ngột, kiểm tra và dọn các bản ghi `integration-…` trong dự án thử nghiệm.

Không có credentials thì chỉ kiểm thử được mã và giao diện không kết nối. Không thể kết luận migration/RLS/CRUD đã hoạt động trên Supabase thật trước khi chạy bài integration này.

## Phạm vi còn giữ nguyên

Tin tức và nội dung giới thiệu còn dùng dữ liệu hiện có. Form liên hệ/báo giá vẫn là demo lưu trình duyệt, **chưa gửi yêu cầu đến nhân viên**; backend nhận yêu cầu không nằm trong CRUD catalogue. Dashboard mới chỉ quản lý danh mục/sản phẩm thật, không dùng các màn hình đơn hàng/giá/doanh thu giả. Route giỏ hàng cũ chuyển về catalogue.

## File chính

- `database/migrations/001_catalog.sql`, `database/schema.sql`, `database/seed.sql`: cấu trúc, RLS, seed danh mục.
- `src/lib/catalog.ts`, `catalog-validation.ts`, `repository.ts`, `admin-http.ts`, `supabase/*`: kiểu dữ liệu, validation, truy vấn, xác thực.
- `src/middleware.ts`, `src/app/api/admin/[resource]/route.ts`, `src/app/api/auth/*`: phiên và API.
- `src/components/dashboard.tsx`, `catalog-admin.css`, `auth-form.tsx`: dashboard và đăng nhập.
- `src/components/catalog.tsx`, `category-tiles.tsx`, `product-information.tsx`, `product-gallery.tsx`: catalogue và chi tiết.
- Các trang store, layout/footer và sitemap dùng repository thay vì dữ liệu sản phẩm demo.
