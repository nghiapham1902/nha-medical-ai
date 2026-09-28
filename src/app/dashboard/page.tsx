import { Dashboard } from "@/components/dashboard";
import { adminSession } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard quản trị",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const { client, status } = await adminSession();
  if (!client) redirect(`/dang-nhap?reason=${status}`);
  return <Dashboard />;
}
