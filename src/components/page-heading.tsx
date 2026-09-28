import Link from "next/link";
export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="page-heading">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
