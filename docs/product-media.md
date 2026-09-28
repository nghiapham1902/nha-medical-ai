# Ảnh và video sản phẩm

Nội dung catalogue được quản lý trong `/dashboard` → Sản phẩm và lưu tại Supabase. Không sửa `src/lib/data.ts` để xuất bản sản phẩm.

- `image`: URL ảnh chính; thư viện tự thêm ảnh chính nếu chưa có trong `media`.
- `media`: danh sách `{ type: "image", src, alt }` hoặc `{ type: "video", src, title, poster? }` theo thứ tự hiển thị.
- `documents`: danh sách `{ name, href }`.

Chỉ nhập URL HTTPS hoặc đường dẫn public thực (ví dụ `/images/products/model-front.jpg`). Ví dụ chỉ mô tả cấu trúc, không phải tệp đã có. Dùng ảnh đúng model, không lấy ảnh minh họa nhóm sản phẩm hoặc tạo thêm góc chụp giả. Chưa có ảnh thì gallery hiển thị trạng thái dự phòng. URL ngoài được trình duyệt tải trực tiếp, không qua dịch vụ tối ưu ảnh server.

Có nhiều nội dung sẽ hiện thumbnail. Nút mở ảnh lớn dùng `dialog`, hỗ trợ Tab/Escape. Video dùng tệp trực tiếp MP4/WebM, có controls, không tự phát; không nhúng URL trang YouTube. Chưa triển khai upload: đưa file đã xác minh lên storage rồi dùng URL công khai lâu dài. Tài liệu chưa có thì không hiện mục tài liệu.
