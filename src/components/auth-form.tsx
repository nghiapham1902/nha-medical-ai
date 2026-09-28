"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Microscope } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="container auth-section">
      <div className="auth-card">
        <aside className="auth-visual">
          <Image
            src="/images/home-laboratory.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 1px, 45vw"
          />
          <div className="auth-visual-copy">
            <Microscope size={34} strokeWidth={1.5} />
            <span>NHA MEDICAL</span>
            <h2>
              Kết nối hôm nay.
              <br />
              Đồng hành dài lâu.
            </h2>
            <p>Thiết bị, vật tư và giải pháp cho y tế & khoa học.</p>
          </div>
        </aside>
        <div className="auth-content">
          <Link href="/" className="auth-back">
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
          <nav className="auth-tabs" aria-label="Tài khoản">
            <Link
              href="/dang-nhap"
              aria-current={!register ? "page" : undefined}
            >
              Đăng nhập
            </Link>
            <Link href="/dang-ky" aria-current={register ? "page" : undefined}>
              Đăng ký
            </Link>
          </nav>
          <h1>{register ? "Tạo tài khoản mới" : "Chào mừng trở lại"}</h1>
          <p className="auth-subtitle">
            {register
              ? "Bắt đầu kết nối cùng NHA Medical."
              : "Đăng nhập để tiếp tục cùng NHA Medical."}
          </p>
          <form
            onInput={() => setMessage("")}
            onSubmit={async (event) => {
              event.preventDefault();
              if (register) {
                setMessage(
                  "Tài khoản quản trị phải được cấp bởi người quản lý hệ thống. Không hỗ trợ tự đăng ký.",
                );
                return;
              }
              setBusy(true);
              try {
                const data = new FormData(event.currentTarget);
                const response = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: data.get("email"),
                    password: data.get("password"),
                  }),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                window.location.assign("/dashboard");
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "Không thể đăng nhập.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {register && (
              <label htmlFor="auth-name">
                Họ và tên
                <input
                  id="auth-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Nhập họ và tên"
                  required
                  maxLength={100}
                  pattern=".*\S.*"
                />
              </label>
            )}
            <label htmlFor="auth-email">
              Email
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ban@congty.vn"
                required
                maxLength={254}
              />
            </label>
            <label htmlFor="auth-password">Mật khẩu</label>
            <div className="auth-password">
              <input
                id="auth-password"
                name="password"
                type={visible ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder={register ? "Tối thiểu 8 ký tự" : "Nhập mật khẩu"}
                required
                minLength={register ? 8 : 1}
                aria-describedby={register ? "password-help" : undefined}
                onChange={(event) => {
                  const confirm = event.currentTarget.form?.elements.namedItem(
                    "confirm",
                  ) as HTMLInputElement | null;
                  if (confirm)
                    confirm.setCustomValidity(
                      confirm.value && confirm.value !== event.target.value
                        ? "Mật khẩu xác nhận chưa khớp."
                        : "",
                    );
                }}
              />
              <button
                type="button"
                aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={visible}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {register && (
              <>
                <p id="password-help" className="auth-help">
                  Sử dụng ít nhất 8 ký tự cho mật khẩu.
                </p>
                <label htmlFor="auth-confirm">
                  Xác nhận mật khẩu
                  <input
                    id="auth-confirm"
                    name="confirm"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    required
                    onChange={(event) => {
                      const password =
                        event.currentTarget.form?.elements.namedItem(
                          "password",
                        ) as HTMLInputElement;
                      event.currentTarget.setCustomValidity(
                        event.target.value !== password.value
                          ? "Mật khẩu xác nhận chưa khớp."
                          : "",
                      );
                    }}
                  />
                </label>
              </>
            )}
            {!register && (
              <div className="auth-assistance">
                <Link href="/lien-he">Cần hỗ trợ đăng nhập?</Link>
              </div>
            )}
            <p className="auth-demo-note">
              Chỉ tài khoản được cấp quyền quản trị mới có thể quản lý
              catalogue.
            </p>
            <button
              className="button primary auth-submit"
              type="submit"
              disabled={busy}
            >
              {busy ? "Đang đăng nhập…" : register ? "Đăng ký" : "Đăng nhập"}
              <ArrowRight size={18} />
            </button>
            <p className="auth-status" role="status">
              {message}
            </p>
          </form>
          <p className="auth-switch">
            {register ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <Link href={register ? "/dang-nhap" : "/dang-ky"}>
              {register ? "Đăng nhập" : "Đăng ký ngay"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
