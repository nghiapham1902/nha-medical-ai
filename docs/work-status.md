# Trạng thái công việc — 27/09/2026

Phạm vi hiện tại: kiểm tra và hoàn thiện quản trị danh mục/sản phẩm dùng Supabase.

## Đã thực hiện trong lượt tiếp tục

- Kiểm tra mã API quản trị, repository, dashboard và bộ kiểm thử hiện có.
- Dashboard kết thúc trạng thái đang tải khi request lỗi và cho phép thử lại; xóa lỗi cũ khi bắt đầu tải lại.
- Khóa chuyển tab và đăng xuất trong lúc lưu/xóa, khóa thao tác trên danh sách trong lúc tải lại/xóa.
- Phân biệt xóa thành công nhưng tải lại danh sách thất bại với lỗi xóa bản ghi.

## Kết quả kiểm tra

- `npm run typecheck`: đạt.
- `npm run build`: đạt.
- `npm run test:browser`: 14 đạt, 1 bỏ qua (integration Supabase thật chưa cấu hình).

## Phần cần kiểm chứng tiếp

- Đã thêm `.env.local` với Project URL và publishable key do người dùng cung cấp (không ghi khóa vào tài liệu). Kiểm tra HEAD trước đó trả 204 nhưng không phản ánh đúng sự tồn tại của bảng. Kiểm tra GET sau ảnh lỗi của người dùng trả 404/PGRST205 cho cả `categories`, `products`, `catalog_admins`: cần chạy migration và seed trên dự án mới. Server local trả 200 ở `/dang-nhap`, API quản trị trả 401 khi chưa đăng nhập. Chưa xác minh đầy đủ schema/RLS hoặc tài khoản admin; chưa áp dụng migration từ công cụ của agent.
- Chạy `tests/catalog-integration.spec.ts` trên dự án thử nghiệm để xác minh Auth, CRUD và RLS qua Supabase thật. Bài SQL trong bộ nhớ không thay thế bước này.
- Kiểm tra thao tác dashboard với phiên admin thật, đặc biệt mất kết nối khi tải/lưu/xóa và xung đột chỉnh sửa. Các thay đổi trạng thái dashboard hiện chưa được kiểm thử tự động bằng phiên admin.

Form liên hệ, upload file và nội dung tin tức nằm ngoài phạm vi lượt này; xem README để biết giới hạn hiện tại.

