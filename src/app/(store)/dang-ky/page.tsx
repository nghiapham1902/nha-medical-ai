import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Đăng ký",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <AuthForm mode="register" />;
}
