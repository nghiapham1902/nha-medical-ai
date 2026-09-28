"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>Không thể tải nội dung</h1>
      <p>Vui lòng thử lại sau ít phút.</p>
      <button className="button primary" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
