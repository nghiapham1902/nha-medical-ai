import { sessionClient } from "@/lib/supabase/server";
import { reply, sameOrigin, failure } from "@/lib/admin-http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const client = await sessionClient();
    if (client) {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
    return reply({ message: "Đã đăng xuất." });
  } catch (error) {
    return failure(error);
  }
}
