export default function Loading() {
  return (
    <section
      className="container section"
      aria-busy="true"
      aria-label="Đang tải sản phẩm"
    >
      <h1>Đang tải sản phẩm…</h1>
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton" style={{ height: 300 }} />
        ))}
      </div>
    </section>
  );
}
