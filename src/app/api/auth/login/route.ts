import { sessionClient } from "@/lib/supabase/server";
import { reply, sameOrigin, readBody, failure } from "@/lib/admin-http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await readBody(request);
    if (
      typeof body.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      body.email.length > 254 ||
      typeof body.password !== "string" ||
      !body.password ||
      body.password.length > 1024
    )
      return reply({ error: "Email hoặc mật khẩu không hợp lệ." }, 400);
    const client = await sessionClient();
    if (!client)
      return reply(
        {
          error: "Backend chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
        },
        503,
      );
    const { data, error } = await client.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (error || !data.user)
      return reply(
        {
          error:
            "Đăng nhập không thành công. Kiểm tra tài khoản hoặc thử lại sau.",
        },
        error?.status === 429 ? 429 : 401,
      );
    const { data: admin, error: roleError } = await client
      .from("catalog_admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (roleError || !admin) {
      await client.auth.signOut();
      return reply(
        {
          error: roleError
            ? "Chưa thể kiểm tra quyền quản trị. Kiểm tra cấu hình backend."
            : "Tài khoản không có quyền quản trị.",
        },
        roleError ? 503 : 403,
      );
    }
    return reply({ message: "Đăng nhập thành công." });
  } catch (error) {
    return failure(error);
  }
}
