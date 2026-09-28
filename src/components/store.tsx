"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  UserRound,
  Menu,
  X,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  LoaderCircle,
} from "lucide-react";

import type { Category } from "@/lib/catalog";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="NHA Medical - Trang chủ">
      <Image
        className="logo-emblem"
        src="/images/nha-logo.svg"
        alt=""
        width={76}
        height={76}
        priority
      />
      <span>
        NHA<span className="logo-medical">MEDICAL</span>
      </span>
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    ["/", "Trang chủ"],
    ["/gioi-thieu", "Về chúng tôi"],
    ["/san-pham", "Sản phẩm"],
    ["/#thuong-hieu", "Thương hiệu"],
    ["/#bao-duong", "Bảo dưỡng"],
    ["/tin-tuc", "Tin tức"],
  ];
  return (
    <header className="landing-header unified-header">
      <div className="container landing-header-inner">
        <Logo />
        <nav
          id="site-navigation"
          className={open ? "landing-nav is-open" : "landing-nav"}
          aria-label="Điều hướng chính"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href !== "/" && pathname.startsWith(href + "/"))
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="landing-header-actions">
          <Link
            href="/dang-nhap"
            className="account-link"
            aria-label="Đăng nhập hoặc đăng ký"
            title="Tài khoản"
          >
            <UserRound size={21} />
          </Link>
          <Link
            href="/lien-he"
            className="button primary"
            onClick={() => setOpen(false)}
          >
            Liên hệ <ArrowRight size={16} />
          </Link>
          <button
            className="landing-menu icon-button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer({
  catalogueCategories = [],
}: {
  catalogueCategories?: Category[];
}) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Giải pháp thiết bị và vật tư cho y tế,
            <br />
            phòng thí nghiệm và nghiên cứu khoa học.
          </p>
          <span className="demo-pill">
            Website demo • Không nhận thanh toán
          </span>
        </div>
        <div>
          <h3>Khám phá</h3>
          <Link href="/gioi-thieu">Về NHA Medical</Link>
          <Link href="/san-pham">Sản phẩm</Link>
          <Link href="/tin-tuc">Tin tức & kiến thức</Link>
          <Link href="/lien-he">Liên hệ & báo giá</Link>
        </div>
        <div>
          <h3>Danh mục sản phẩm</h3>
          {catalogueCategories.slice(0, 4).map((c) => (
            <Link key={c.id} href={`/danh-muc/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Kết nối với chúng tôi</h3>
          <p>
            <MapPin size={15} /> 91 Hoàng Công, Kiến Hưng, Hà Đông
          </p>
          <p>
            <Phone size={15} />{" "}
            <a href="tel:+84326456768">Hotline: +84 326 4567 68</a>
          </p>
          <p>
            <Mail size={15} />{" "}
            <a href="mailto:info@nhamedical.vn">info@nhamedical.vn</a>
          </p>
          <Link href="/lien-he" className="footer-contact">
            Gửi yêu cầu tư vấn <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 NHA Medical. Bản giao diện thử nghiệm.</span>
        <span>Thông tin và hình ảnh chỉ mang tính minh họa.</span>
      </div>
    </footer>
  );
}
export function ContactForm() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("Tư vấn sản phẩm");
  const [subject, setSubject] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("type") === "quote") setType("Yêu cầu báo giá");
    if (q.get("type") === "maintenance") setType("Dịch vụ bảo dưỡng");
    if (q.get("product")) setSubject(`Sản phẩm: ${q.get("product")}`);
  }, []);
  return (
    <form
      className="contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const data = new FormData(e.currentTarget);
        await new Promise((r) => setTimeout(r, 500));
        try {
          const saved = JSON.parse(localStorage.getItem("nha-quotes") || "[]");
          localStorage.setItem(
            "nha-quotes",
            JSON.stringify([
              ...saved,
              {
                ...Object.fromEntries(data),
                id: `BG-${Date.now()}`,

                status: "Mới",
                date: new Date().toLocaleDateString("vi-VN"),
              },
            ]),
          );
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
    >
      <span className="eyebrow">CHÚNG TÔI SẴN SÀNG LẮNG NGHE</span>
      <h2>Trao đổi nhu cầu của bạn</h2>
      <p>Biểu mẫu demo lưu trên trình duyệt này, chưa gửi đến NHA Medical.</p>
      <div className="form-grid">
        <label>
          Họ và tên *
          <input
            required
            name="name"
            placeholder="Nguyễn Văn An"
            maxLength={100}
          />
        </label>
        <label>
          Số điện thoại *
          <input
            required
            name="phone"
            type="tel"
            pattern="[+0-9 ()-]{9,20}"
            placeholder="Số điện thoại liên hệ"
          />
        </label>
        <label>
          Email *
          <input
            required
            name="email"
            type="email"
            placeholder="ban@congty.vn"
          />
        </label>
        <label>
          Đơn vị / Tổ chức
          <input name="company" placeholder="Tên đơn vị" />
        </label>
      </div>
      <label>
        Nhu cầu
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Tư vấn sản phẩm</option>
          <option>Yêu cầu báo giá</option>
          <option>Dịch vụ bảo dưỡng</option>
          <option>Liên hệ hợp tác</option>
        </select>
      </label>
      <label>
        Nội dung *
        <textarea
          name="content"
          required
          rows={4}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Sản phẩm, số lượng và yêu cầu của bạn…"
        />
      </label>
      <label className="checkbox">
        <input type="checkbox" required /> Tôi đồng ý lưu thông tin trên trình
        duyệt để thử nghiệm biểu mẫu.
      </label>
      <button className="button primary" disabled={status === "loading"}>
        {status === "loading" ? (
          <LoaderCircle className="spin" size={17} />
        ) : (
          <ArrowRight size={17} />
        )}{" "}
        Lưu yêu cầu demo
      </button>
      <div role="status">
        {status === "success" && (
          <p className="success">
            Đã lưu yêu cầu demo. Bạn có thể xem trong Dashboard → Báo giá. Chưa
            có email nào được gửi.
          </p>
        )}
        {status === "error" && (
          <p className="error-message">
            Không thể lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt và thử
            lại.
          </p>
        )}
      </div>
    </form>
  );
}
