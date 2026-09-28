import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <span className="eyebrow">404</span>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn có thể đã thay đổi.</p>
      <Link className="button primary" href="/">
        Về trang chủ
      </Link>
    </div>
  );
}
