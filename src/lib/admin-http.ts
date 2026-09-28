import "server-only";
import { NextResponse } from "next/server";
import { ValidationError } from "./catalog-validation";
export function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (!origin || origin !== new URL(expected).origin)
    throw new ValidationError("Nguồn yêu cầu không hợp lệ. Hãy tải lại trang.");
}
export async function readBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new ValidationError("Yêu cầu phải dùng JSON.");
  // Bound the actual streamed body, not only the untrusted Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) throw new ValidationError("Thiếu nội dung yêu cầu.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 512000) {
      await reader.cancel();
      throw new ValidationError("Dữ liệu vượt quá 500 KB.");
    }
    chunks.push(value);
  }
  try {
    const bytes = new Uint8Array(length);
    let offset = 0;
    chunks.forEach((chunk) => {
      bytes.set(chunk, offset);
      offset += chunk.length;
    });
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new ValidationError("JSON không hợp lệ.");
  }
}
export function databaseFailure(code: string) {
  if (code === "23505")
    return reply(
      { error: "Slug hoặc SKU đã tồn tại. Hãy dùng giá trị khác." },
      409,
    );
  if (code === "23503" || code === "23001")
    return reply(
      {
        error:
          "Danh mục đang có sản phẩm hoặc không còn tồn tại. Hãy chuyển sản phẩm sang danh mục khác hoặc ẩn danh mục thay vì xóa.",
      },
      409,
    );
  if (code === "42501")
    return reply({ error: "Bạn không có quyền thực hiện thao tác này." }, 403);
  if (code === "23514" || code === "22P02")
    return reply(
      { error: "Dữ liệu không hợp lệ. Kiểm tra các trường và URL." },
      400,
    );
  return reply(
    {
      error:
        "Không thể lưu/tải dữ liệu. Kiểm tra kết nối và migration Supabase.",
    },
    503,
  );
}
export function failure(error: unknown) {
  return error instanceof ValidationError
    ? reply({ error: error.message }, 400)
    : reply({ error: "Không thể kết nối hệ thống. Vui lòng thử lại." }, 503);
}
