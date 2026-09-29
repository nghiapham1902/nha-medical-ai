import { adminSession } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import { revalidateTag } from "next/cache";
import { sanitizeIntroduction } from "@/lib/article-html";
import {
  validateCategory,
  validateProduct,
  validateId,
  validateVersion,
} from "@/lib/catalog-validation";
import {
  reply,
  sameOrigin,
  readBody,
  databaseFailure,
  failure,
} from "@/lib/admin-http";
type Context = { params: Promise<{ resource: string }> };
export const dynamic = "force-dynamic";
async function handle(request: Request, context: Context) {
  try {
    const { resource } = await context.params;
    if (resource !== "categories" && resource !== "products")
      return reply({ error: "Không tìm thấy." }, 404);
    if (request.method !== "GET") sameOrigin(request);
    const { client, status } = await adminSession();
    if (!client)
      return reply(
        {
          error:
            status === 503
              ? "Backend chưa được cấu hình hoặc không thể kết nối."
              : status === 401
                ? "Vui lòng đăng nhập."
                : "Tài khoản không có quyền quản trị.",
        },
        status,
      );
    if (request.method === "GET") {
      const { data, error } = await client
        .from(resource)
        .select("*")
        .order(resource === "categories" ? "sort_order" : "updated_at", {
          ascending: resource === "categories",
        });
      return error
        ? databaseFailure(error.code)
        : reply({ data, project: supabaseConfig()?.url });
    }
    const body = await readBody(request);
    const id = request.method === "POST" ? undefined : validateId(body.id);
    const version =
      request.method === "POST" ? undefined : validateVersion(body.updated_at);
    if (request.method === "DELETE") {
      const { data, error } = await client
        .from(resource)
        .delete()
        .eq("id", id!)
        .eq("updated_at", version!)
        .select("id");
      if (error) return databaseFailure(error.code);
      if (data?.length) revalidateTag("public-catalog");
      return data?.length
        ? reply({ message: "Đã xóa." })
        : reply(
            {
              error:
                "Bản ghi đã thay đổi hoặc bị xóa. Hãy tải lại trước khi tiếp tục.",
            },
            409,
          );
    }
    const values: Record<string, unknown> = {
      ...(resource === "categories"
        ? validateCategory(body)
        : validateProduct(body)),
    };
    if (resource === "products") values.introduction = sanitizeIntroduction(values.introduction as string);
    const query =
      request.method === "POST"
        ? client.from(resource).insert(values)
        : client
            .from(resource)
            .update(values)
            .eq("id", id!)
            .eq("updated_at", version!);
    const { data, error } = await query.select("*").maybeSingle();
    if (error) return databaseFailure(error.code);
    if (!data)
      return reply(
        { error: "Bản ghi đã thay đổi. Hãy tải lại để tránh ghi đè dữ liệu." },
        409,
      );
    revalidateTag("public-catalog");
    return reply(
      { data, message: "Đã lưu thành công." },
      request.method === "POST" ? 201 : 200,
    );
  } catch (error) {
    return failure(error);
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
